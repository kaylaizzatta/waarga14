import { createServerSupabaseClient } from './supabase-server';
import { mapUsernameToRT } from './rt-utils';
import type { UserSession } from './types';

export { mapUsernameToRT };
export type { WargaURLParams } from './warga-utils';

export const PAGE_SIZE = 10;

// ── Types ─────────────────────────────────────────────────────────

export interface WargaRow {
  id: number;
  created_at: string;
  nama: string;
  asal_rt_domisili: string;
  alamat: string;
  status_dalam_keluarga: string;
  tahun_kelahiran: number;
  jenis_kelamin: string;
  tingkat_pendidikan_terakhir: string;
  jenis_pekerjaan: string;
  status_perkawinan: string;
  status_kepemilikan_rumah: string;
  status_penerimaan_bantuan: string;
  jenis_bpjs_kesehatan: string;
  agama: string;
  is_deleted?: boolean;
  status_warga: string;
  deleted_at?: string | null;
}

export interface WargaPageStats {
  totalWarga: number;
  totalLaki: number;
  totalPerempuan: number;
  totalKK: number;
}

export interface WargaQueryResult {
  rows: WargaRow[];
  total: number;
}

export interface WargaQueryFilters {
  rtFilter: string | null;
  search: string;
  alamat: string;
  statusKeluarga: string;
  gender: string;
  pendidikan: string;
  pekerjaan: string;
  bpjs: string;
  statusBantuan: string;
  statusWarga: string;
}

// ── Filter engine (reusable Tahap 3) ─────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyWargaFilters(query: any, filters: WargaQueryFilters): any {
  if (filters.rtFilter)         query = query.eq('asal_rt_domisili',           filters.rtFilter);
  if (filters.search.trim())    query = query.ilike('nama',                    `%${filters.search.trim()}%`);
  if (filters.alamat.trim())    query = query.ilike('alamat',                  `%${filters.alamat.trim()}%`);
  if (filters.statusKeluarga)   query = query.eq('status_dalam_keluarga',      filters.statusKeluarga);
  if (filters.gender)           query = query.eq('jenis_kelamin',              filters.gender);
  if (filters.pendidikan)       query = query.eq('tingkat_pendidikan_terakhir',filters.pendidikan);
  if (filters.pekerjaan)        query = query.eq('jenis_pekerjaan',            filters.pekerjaan);
  if (filters.bpjs)             query = query.eq('jenis_bpjs_kesehatan',       filters.bpjs);          // ← BARU
  if (filters.statusBantuan)    query = query.eq('status_penerimaan_bantuan',  filters.statusBantuan); // ← BARU
  if (filters.statusWarga)      query = query.eq('status_warga',               filters.statusWarga); 
  return query;
}

// ── RT helpers ────────────────────────────────────────────────────

export function resolveRTFilter(session: UserSession, rtParam: string): string | null {
  if (session.role === 'RT') return mapUsernameToRT(session.username);
  return rtParam || null;
}

// ── Distinct value queries ────────────────────────────────────────

async function getDistinctColumn(column: string): Promise<string[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('warga-rw14')
    .select(column)
    .eq('is_deleted', false)
    .not(column, 'is', null);

  if (error || !data) return [];

  const values = data
    .map((r: Record<string, string>) => (r[column] ?? '').trim())
    .filter(Boolean);

  return [...new Set(values)].sort();
}

export const getDistinctRTs             = () => getDistinctColumn('asal_rt_domisili');
export const getDistinctStatusKeluarga  = () => getDistinctColumn('status_dalam_keluarga');
export const getDistinctPendidikan      = () => getDistinctColumn('tingkat_pendidikan_terakhir');
export const getDistinctPekerjaan       = () => getDistinctColumn('jenis_pekerjaan');
export const getDistinctBPJS            = () => getDistinctColumn('jenis_bpjs_kesehatan');       // ← BARU
export const getDistinctStatusBantuan   = () => getDistinctColumn('status_penerimaan_bantuan');  // ← BARU
export const getDistinctStatusWarga     = () => getDistinctColumn('status_warga');

// ── Main queries ──────────────────────────────────────────────────

export async function getWargaPageStats(
  rtFilter: string | null
): Promise<WargaPageStats | null> {
  const supabase = createServerSupabaseClient();

  try {
    const [
      { count: totalWarga, error: e1 },
      { count: totalLaki, error: e2 },
      { count: totalPerempuan, error: e3 },
      { count: totalKK, error: e4 },
    ] = await Promise.all([
      rtFilter
        ? supabase
            .from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false)
            .eq('asal_rt_domisili', rtFilter)
        : supabase
            .from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false),

      rtFilter
        ? supabase
            .from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false)
            .eq('asal_rt_domisili', rtFilter)
            .eq('jenis_kelamin', 'Laki-laki')
        : supabase
            .from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false)
            .eq('jenis_kelamin', 'Laki-laki'),

      rtFilter
        ? supabase
            .from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false)
            .eq('asal_rt_domisili', rtFilter)
            .eq('jenis_kelamin', 'Perempuan')
        : supabase
            .from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false)
            .eq('jenis_kelamin', 'Perempuan'),

      rtFilter
        ? supabase
            .from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false)
            .eq('asal_rt_domisili', rtFilter)
            .eq('status_dalam_keluarga', 'Kepala Keluarga')
        : supabase
            .from('warga-rw14')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false)
            .eq('status_dalam_keluarga', 'Kepala Keluarga'),
    ]);

    if (e1 || e2 || e3 || e4) {
      console.error('[getWargaPageStats]', e1 || e2 || e3 || e4);
      return null;
    }

    return {
      totalWarga: totalWarga ?? 0,
      totalLaki: totalLaki ?? 0,
      totalPerempuan: totalPerempuan ?? 0,
      totalKK: totalKK ?? 0,
    };
  } catch (err) {
    console.error('[getWargaPageStats] unexpected:', err);
    return null;
  }
}

export async function getWargaData(
  filters: WargaQueryFilters,
  page: number
): Promise<WargaQueryResult> {
  const supabase = createServerSupabaseClient();

  try {
    let query = supabase.from('warga-rw14').select('*', { count: 'exact' }).eq('is_deleted', false);
    query = applyWargaFilters(query, filters);

    const from = (page - 1) * PAGE_SIZE;
    const to   = from + PAGE_SIZE - 1;

    const { data, count, error } = await query
      .order('id', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('[getWargaData]', error);
      return { rows: [], total: 0 };
    }

    return {
      rows:  (data ?? []) as WargaRow[],
      total: count ?? 0,
    };
  } catch (err) {
    console.error('[getWargaData] unexpected:', err);
    return { rows: [], total: 0 };
  }
}

// ── Helper cari halaman warga ────────────────────────────────────

export async function getPageByWargaId(
  id: number
): Promise<number> {
  const supabase = createServerSupabaseClient();

  const { count } = await supabase
    .from('warga-rw14')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('is_deleted', false)
    .lt('id', id);

  return Math.floor((count ?? 0) / PAGE_SIZE) + 1;
}

// ── Single row query ──────────────────────────────────────────────

export async function getWargaById(
  id: number
): Promise<WargaRow | null> {
  const supabase =
    createServerSupabaseClient();

  try {
    const { data, error } =
      await supabase
        .from('warga-rw14')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
      console.error(
        '[getWargaById]',
        error
      );

      return null;
    }

    return data as WargaRow;
  } catch (err) {
    console.error(
      '[getWargaById] unexpected:',
      err
    );

    return null;
  }
}

export async function softDeleteWarga(
  id: number,
  statusWarga: string
): Promise<boolean> {
  const supabase =
    createServerSupabaseClient();

  const { error } =
    await supabase
      .from('warga-rw14')
      .update({
        is_deleted: true,
        status_warga: statusWarga,
        deleted_at:
          new Date().toISOString(),
      })
      .eq('id', id);

  if (error) {
    console.error(
      '[softDeleteWarga]',
      error
    );

    return false;
  }

  return true;
}

export async function restoreWarga(
  id: number
): Promise<boolean> {
  const supabase =
    createServerSupabaseClient();

  const { error } =
    await supabase
      .from('warga-rw14')
      .update({
        is_deleted: false,
        status_warga: 'Aktif',
        deleted_at: null,
      })
      .eq('id', id);

  if (error) {
    console.error(
      '[restoreWarga]',
      error
    );

    return false;
  }

  return true;
}

export async function getDeletedWarga(
  rtFilter: string | null,
  statusWarga?: string,
  startDate?: string,
  endDate?: string
) {
  const supabase =
    createServerSupabaseClient();

  let query = supabase
    .from('warga-rw14')
    .select('*')
    .eq('is_deleted', true);

  if (rtFilter) {
    query = query.eq(
      'asal_rt_domisili',
      rtFilter
    );
  }

  if (statusWarga) {
    query = query.eq(
      'status_warga',
      statusWarga
    );
  }

  if (startDate) {
    query = query.gte(
      'deleted_at',
      startDate
    );
  }

  if (endDate) {
    query = query.lte(
      'deleted_at',
      `${endDate}T23:59:59`
    );
  }

  const { data, error } =
    await query.order(
      'deleted_at',
      { ascending: false }
    );

  if (error) {
    console.error(
      '[getDeletedWarga]',
      error
    );

    return [];
  }

  return data ?? [];
}

export async function getDeletedWargaById(
  id: number
): Promise<WargaRow | null> {
  const supabase =
    createServerSupabaseClient();

  const { data, error } =
    await supabase
      .from('warga-rw14')
      .select('*')
      .eq('id', id)
      .single();

  if (error || !data) {
    return null;
  }

  return data as WargaRow;
}