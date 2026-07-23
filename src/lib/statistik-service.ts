import { createServerSupabaseClient } from './supabase-server';
import { resolveRTFilter } from './warga-service';
import type { UserSession } from './types';

// ── Types ─────────────────────────────────────────────────────────

export interface ChartDataPoint {
  name:       string;
  value:      number;
  percentage: number;   // 1 decimal, e.g. 33.3
}

export interface StatistikSummaryData {
  totalWarga: number;
  totalKK:    number;
  scope:      string;   // "RW 14" | "RT 01" | ...
}

export interface StatistikPageData {
  summary:             StatistikSummaryData;
  genderStats:         ChartDataPoint[];
  statusKeluargaStats: ChartDataPoint[];
}

// ── Internal helpers ──────────────────────────────────────────────

/**
 * Fetch satu kolom (+ optional RT filter), aggregate ke Record<value, count>.
 * Berjalan server-side; hanya mengirim kolom yang diperlukan ke klien.
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

  if (rtFilter) {
    query = query.eq('asal_rt_domisili', rtFilter);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error(`[countByColumn] column=${column}:`, error?.message);
    return {};
  }

  const result: Record<string, number> = {};

  const rows = data as unknown[];

  for (const row of rows) {
    const value = (row as Record<string, unknown>)[column];

    if (typeof value === 'string') {
      const trimmed = value.trim();

      if (trimmed) {
        result[trimmed] = (result[trimmed] ?? 0) + 1;
      }
    }
  }

  return result;
}

/**
 * Konversi Record<name, count> → ChartDataPoint[] sorted descending by value.
 */
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

// ── Public API ────────────────────────────────────────────────────

/**
 * Ambil seluruh data yang dibutuhkan halaman Statistik (Tahap 3A).
 * Semua query berjalan paralel via Promise.all.
 *
 * Role RW  → rtFilter = null  → data seluruh RW 14
 * Role RT  → rtFilter = "RT 01" (mapped dari username)
 */
export async function getStatistikPageData(
  session: UserSession
): Promise<StatistikPageData | null> {
  const supabase  = createServerSupabaseClient();
  const rtFilter  = resolveRTFilter(session, '');     // '' = tidak ada pilihan user
  const scope     = rtFilter ?? 'RW 14';

  try {
    const [
      { count: totalWarga, error: e1 },
      { count: totalKK,    error: e2 },
      genderCounts,
      statusKelCounts,
    ] = await Promise.all([

      // Total warga (scope)
      rtFilter
        ? supabase.from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('asal_rt_domisili', rtFilter)
        : supabase.from('warga-rw14')
            .select('*', { count: 'exact', head: true }),

      // Total KK (scope)
      rtFilter
        ? supabase.from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('asal_rt_domisili', rtFilter)
            .eq('status_dalam_keluarga', 'Kepala Keluarga')
        : supabase.from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('status_dalam_keluarga', 'Kepala Keluarga'),

      countByColumn('jenis_kelamin',      rtFilter),
      countByColumn('status_dalam_keluarga', rtFilter),
    ]);

    if (e1 || e2) {
      console.error('[getStatistikPageData]', e1 ?? e2);
      return null;
    }

    return {
      summary: {
        totalWarga: totalWarga ?? 0,
        totalKK:    totalKK    ?? 0,
        scope,
      },
      genderStats:         toChartData(genderCounts),
      statusKeluargaStats: toChartData(statusKelCounts),
    };
  } catch (err) {
    console.error('[getStatistikPageData] unexpected:', err);
    return null;
  }
}