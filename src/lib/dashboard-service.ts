import { createServerSupabaseClient } from './supabase-server';
import { resolveRTFilter } from './warga-service';
import type { UserSession } from './types';

// ── Types ─────────────────────────────────────────────────────────

export interface ChartDataPoint {
  name:       string;
  value:      number;
  percentage: number;
}

export interface DashboardKPI {
  totalWarga:     number;
  totalKK:        number;
  totalLaki:      number;
  totalPerempuan: number;
}

export interface TopInsight {
  name:       string;
  value:      number;
  percentage: number;
}

export interface RTRankingRow {
  rt:           string;
  totalWarga:   number;
  totalKK:      number;
  totalBantuan: number;
}

export interface DashboardPageData {
  scope:               string;
  kpi:                 DashboardKPI;
  genderStats:         ChartDataPoint[];
  statusKeluargaStats: ChartDataPoint[];
  bpjsStats:           ChartDataPoint[];
  bantuanStats:        ChartDataPoint[];
  topPendidikan:       TopInsight | null;
  topPekerjaan:        TopInsight | null;
  rtRanking:           RTRankingRow[] | null; // null = akun RT
}

// ── Internal helpers ──────────────────────────────────────────────

/**
 * Fetch satu kolom dari tabel, aggregate ke Record<nilai, jumlah>.
 * Dijalankan server-side; payload sangat kecil (hanya 1 kolom × n baris).
 */
async function countByColumn(
  column: string,
  rtFilter: string | null
): Promise<Record<string, number>> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('warga-rw14')
    .select(column)
    .not(column, 'is', null);

  if (rtFilter) query = query.eq('asal_rt_domisili', rtFilter);

  const { data, error } = await query;

  if (error || !data) {
    console.error(`[countByColumn] ${column}:`, error?.message);
    return {};
  }

  return (data as Record<string, string>[]).reduce((acc, row) => {
    const val = (row[column] ?? '').trim();
    if (val) acc[val] = (acc[val] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/** Record<name,count> → ChartDataPoint[] terurut descending by value */
function toChartData(counts: Record<string, number>): ChartDataPoint[] {
  const total = Object.values(counts).reduce((s, v) => s + v, 0);
  if (total === 0) return [];

  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: parseFloat(((value / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value);
}

/** Ambil satu entry teratas (terbanyak) sebagai InsightCard data */
function getTopInsight(counts: Record<string, number>): TopInsight | null {
  const total = Object.values(counts).reduce((s, v) => s + v, 0);
  if (total === 0) return null;

  const [top] = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!top) return null;

  const [name, value] = top;
  return {
    name,
    value,
    percentage: parseFloat(((value / total) * 100).toFixed(1)),
  };
}

/**
 * Fetch 3 kolom, aggregate per RT untuk tabel ranking.
 * Hanya dipanggil untuk akun RW (lewat Promise.resolve(null) untuk RT).
 */
async function fetchRTRanking(): Promise<RTRankingRow[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('warga-rw14')
    .select('asal_rt_domisili, status_dalam_keluarga, status_penerimaan_bantuan');

  if (error || !data) {
    console.error('[fetchRTRanking]:', error?.message);
    return [];
  }

  type Row = {
    asal_rt_domisili:       string;
    status_dalam_keluarga:  string;
    status_penerimaan_bantuan: string;
  };

  const map: Record<string, { warga: number; kk: number; bantuan: number }> = {};

  for (const row of data as Row[]) {
    const rt = row.asal_rt_domisili?.trim();
    if (!rt) continue;

    if (!map[rt]) map[rt] = { warga: 0, kk: 0, bantuan: 0 };
    map[rt].warga++;
    if (row.status_dalam_keluarga?.trim()      === 'Kepala Keluarga') map[rt].kk++;
    if (row.status_penerimaan_bantuan?.trim()   === 'Ya')              map[rt].bantuan++;
  }

  return Object.entries(map)
    .map(([rt, s]) => ({
      rt,
      totalWarga:   s.warga,
      totalKK:      s.kk,
      totalBantuan: s.bantuan,
    }))
    .sort((a, b) => b.totalWarga - a.totalWarga); // urut: terbanyak warga = #1
}

// ── Public API ────────────────────────────────────────────────────

/**
 * Satu fungsi mengambil SELURUH data Dashboard dalam 11 query paralel.
 *
 * Role RW  → rtFilter = null  → semua warga RW 14
 * Role RT  → rtFilter = "RT 01" (auto dari username)
 *
 * Queries (semua via Promise.all):
 *  1–4.  COUNT warga, KK, laki, perempuan (head=true, sangat cepat)
 *  5–10. Fetch 1 kolom per kategori chart (payload minimal)
 *  11.   Fetch 3 kolom untuk RT ranking (RW saja)
 */
export async function getDashboardPageData(
  session: UserSession
): Promise<DashboardPageData | null> {
  const supabase = createServerSupabaseClient();
  const rtFilter = resolveRTFilter(session, '');
  const scope    = rtFilter ?? 'RW 14';
  const isRW     = session.role === 'RW';

  try {
    const [
      { count: totalWarga,     error: e1 },
      { count: totalKK,        error: e2 },
      { count: totalLaki,      error: e3 },
      { count: totalPerempuan, error: e4 },
      genderCounts,
      statusKelCounts,
      bpjsCounts,
      bantuanCounts,
      pendidikanCounts,
      pekerjaanCounts,
      rtRankingResult,
    ] = await Promise.all([

      // ── KPI (4 HEAD queries) ──────────────────────────────────
      rtFilter
        ? supabase.from('warga-rw14').select('*', { count: 'exact', head: true }).eq('asal_rt_domisili', rtFilter)
        : supabase.from('warga-rw14').select('*', { count: 'exact', head: true }),

      rtFilter
        ? supabase.from('warga-rw14').select('*', { count: 'exact', head: true }).eq('asal_rt_domisili', rtFilter).eq('status_dalam_keluarga', 'Kepala Keluarga')
        : supabase.from('warga-rw14').select('*', { count: 'exact', head: true }).eq('status_dalam_keluarga', 'Kepala Keluarga'),

      rtFilter
        ? supabase.from('warga-rw14').select('*', { count: 'exact', head: true }).eq('asal_rt_domisili', rtFilter).eq('jenis_kelamin', 'Laki-laki')
        : supabase.from('warga-rw14').select('*', { count: 'exact', head: true }).eq('jenis_kelamin', 'Laki-laki'),

      rtFilter
        ? supabase.from('warga-rw14').select('*', { count: 'exact', head: true }).eq('asal_rt_domisili', rtFilter).eq('jenis_kelamin', 'Perempuan')
        : supabase.from('warga-rw14').select('*', { count: 'exact', head: true }).eq('jenis_kelamin', 'Perempuan'),

      // ── Chart data (6 column-fetch queries) ──────────────────
      countByColumn('jenis_kelamin',               rtFilter),
      countByColumn('status_dalam_keluarga',       rtFilter),
      countByColumn('jenis_bpjs_kesehatan',        rtFilter),
      countByColumn('status_penerimaan_bantuan',   rtFilter),
      countByColumn('tingkat_pendidikan_terakhir', rtFilter),
      countByColumn('jenis_pekerjaan',             rtFilter),

      // ── RT Ranking (1 multi-column fetch, RW only) ───────────
      isRW ? fetchRTRanking() : Promise.resolve(null),
    ]);

    if (e1 || e2 || e3 || e4) {
      console.error('[getDashboardPageData] KPI error:', e1 ?? e2 ?? e3 ?? e4);
      return null;
    }

    return {
      scope,
      kpi: {
        totalWarga:     totalWarga     ?? 0,
        totalKK:        totalKK        ?? 0,
        totalLaki:      totalLaki      ?? 0,
        totalPerempuan: totalPerempuan ?? 0,
      },
      genderStats:         toChartData(genderCounts),
      statusKeluargaStats: toChartData(statusKelCounts),
      bpjsStats:           toChartData(bpjsCounts),
      bantuanStats:        toChartData(bantuanCounts),
      topPendidikan:       getTopInsight(pendidikanCounts),
      topPekerjaan:        getTopInsight(pekerjaanCounts),
      rtRanking:           rtRankingResult,
    };
  } catch (err) {
    console.error('[getDashboardPageData] unexpected:', err);
    return null;
  }
}

// ── Last Updated Info ─────────────────────────────────────────────

export interface LastUpdatedInfo {
  tanggal: string;
  olehRT: string | null; // null untuk akun RT
}

/**
 * Ambil timestamp record terakhir yang diperbarui.
 * Untuk RW: sertakan RT asal record tersebut sebagai "oleh RT".
 * Fallback aman ke tanggal hari ini jika kolom tidak ada / query gagal.
 */
export async function getLastUpdatedInfo(
  session: UserSession
): Promise<LastUpdatedInfo> {
  const fallback: LastUpdatedInfo = {
    tanggal: new Date().toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    }),
    olehRT: null,
  };

  try {
    const supabase = createServerSupabaseClient();
    const isRW     = session.role === 'RW';

    const { data, error } = await supabase
      .from('warga-rw14')
      .select('updated_at, asal_rt_domisili')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) return fallback;

    const row = data[0] as {
      updated_at?:       string | null;
      asal_rt_domisili?: string | null;
    };

    if (!row.updated_at) return fallback;

    const tanggal = new Date(row.updated_at).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    });

    return {
      tanggal,
      // Akun RT tidak perlu tahu RT siapa yang update — set null
      olehRT: isRW ? (row.asal_rt_domisili?.trim() ?? null) : null,
    };
  } catch {
    // Kolom updated_at belum ada, query gagal, atau error lain → fallback
    return fallback;
  }
}