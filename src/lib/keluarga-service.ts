import { createServerSupabaseClient } from './supabase-server';
import { mapUsernameToRT } from './rt-utils';
import type { UserSession } from './types';

export const KELUARGA_PAGE_SIZE = 15;

function normalizeRT(value: string | null | undefined): string {
  return (value ?? '').trim().toUpperCase();
}

function getSessionRT(session: UserSession): string {
  if (session.role !== 'RT') return '';
  return normalizeRT(mapUsernameToRT(session.username));
}

/* =========================
   TYPES
========================= */

export interface KeluargaSummary {
  totalKeluarga: number;
  wargaTerhubung: number;
  wargaBelumTerhubung: number;
}

export interface KeluargaAnggotaRow {
  id: number;
  nama: string;
  status_dalam_keluarga: string | null;
  jenis_kelamin: string | null;
  tahun_kelahiran: number | null;
  status_warga: string | null;
  asal_rt_domisili: string | null;
  alamat: string | null;
}

export interface KeluargaListRow {
  id: string;
  nama_keluarga: string;
  kepala_keluarga_id: number | null;
  kepala_keluarga_nama: string | null;
  rt: string;
  alamat: string;
  status_keluarga: string;
  jumlah_anggota: number;
  created_at: string;
  anggota?: KeluargaAnggotaRow[];
}

export interface KeluargaQueryFilters {
  rt?: string;
  anggota?: string;
  status?: string;
}

export interface KeluargaListResult {
  rows: KeluargaListRow[];
  total: number;
}

export interface AvailableWargaRow {
  id: number;
  nama: string;
  rt: string;
  alamat: string | null;
  status_warga: string | null;
}

/* =========================
   SUMMARY
========================= */

export async function getKeluargaSummary(
  session: UserSession
): Promise<KeluargaSummary> {
  const supabase = createServerSupabaseClient();
  const sessionRT = getSessionRT(session);

  // 1) Ambil semua keluarga (minimal kolom yang diperlukan)
  const { data: keluargaRows, error: keluargaError } = await supabase
    .from('keluarga')
    .select('id, rt');

  if (keluargaError || !keluargaRows) {
    console.error('[getKeluargaSummary:keluarga]', keluargaError);
    return {
      totalKeluarga: 0,
      wargaTerhubung: 0,
      wargaBelumTerhubung: 0,
    };
  }

  const accessibleKeluarga =
    session.role === 'RW'
      ? keluargaRows
      : keluargaRows.filter((row) => normalizeRT(row.rt) === sessionRT);

  const accessibleKeluargaIds = new Set(accessibleKeluarga.map((row) => row.id));
  const totalKeluarga = accessibleKeluarga.length;

  // 2) Ambil warga aktif
  const { data: wargaRows, error: wargaError } = await supabase
    .from('warga-rw14')
    .select('id, keluarga_id, asal_rt_domisili')
    .eq('is_deleted', false);

  if (wargaError || !wargaRows) {
    console.error('[getKeluargaSummary:warga]', wargaError);
    return {
      totalKeluarga,
      wargaTerhubung: 0,
      wargaBelumTerhubung: 0,
    };
  }

  const accessibleWarga =
    session.role === 'RW'
      ? wargaRows
      : wargaRows.filter(
          (row) => normalizeRT(row.asal_rt_domisili) === sessionRT
        );

  const wargaTerhubung = accessibleWarga.filter((row) => {
    if (!row.keluarga_id) return false;
    if (session.role === 'RW') return true;
    return accessibleKeluargaIds.has(row.keluarga_id);
  }).length;

  const wargaBelumTerhubung = accessibleWarga.filter(
    (row) => row.keluarga_id === null
  ).length;

  return {
    totalKeluarga,
    wargaTerhubung,
    wargaBelumTerhubung,
  };
}

/* =========================
   FILTER OPTIONS
========================= */

export async function getDistinctKeluargaRTOptions(
  session: UserSession
): Promise<string[]> {
  if (session.role === 'RT') {
    const rt = getSessionRT(session);
    return rt ? [rt] : [];
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('keluarga')
    .select('rt')
    .order('rt', { ascending: true });

  if (error || !data) {
    console.error('[getDistinctKeluargaRTOptions]', error);
    return [];
  }

  return Array.from(
    new Set(
      data
        .map((row) => row.rt)
        .filter((value): value is string => Boolean(value))
    )
  );
}

export async function getDistinctKeluargaStatusOptions(
  session: UserSession
): Promise<string[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase.from('keluarga').select('status_keluarga');

  if (session.role === 'RT') {
    query = query.eq('rt', getSessionRT(session));
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error('[getDistinctKeluargaStatusOptions]', error);
    return [];
  }

  return Array.from(
    new Set(
      data
        .map((row) => row.status_keluarga)
        .filter((value): value is string => Boolean(value))
    )
  );
}

/* =========================
   KELUARGA LIST + ANGGOTA
========================= */

function applyKeluargaRTFilter(
  session: UserSession,
  rtParam?: string
): string {
  if (session.role === 'RT') {
    return getSessionRT(session);
  }
  return normalizeRT(rtParam);
}

function parseAnggotaFilter(value?: string): { min?: number; max?: number } {
  const normalized = (value ?? '').trim().toLowerCase();

  switch (normalized) {
    case '1':
      return { min: 1, max: 1 };
    case '2-4':
      return { min: 2, max: 4 };
    case '5+':
      return { min: 5 };
    default:
      return {};
  }
}

export async function getKeluargaList(
  session: UserSession,
  filters: KeluargaQueryFilters,
  page: number
): Promise<KeluargaListResult> {
  const supabase = createServerSupabaseClient();
  const currentPage = Math.max(1, page);

  const rtFilter = applyKeluargaRTFilter(session, filters.rt);
  const statusFilter = (filters.status ?? '').trim();
  const anggotaFilter = parseAnggotaFilter(filters.anggota);

  // 1) Ambil keluarga dasar
  let keluargaQuery = supabase
    .from('keluarga')
    .select(
      `
      id,
      nama_keluarga,
      kepala_keluarga_id,
      rt,
      alamat,
      status_keluarga,
      created_at
    `
    )
    .order('rt', { ascending: true })
    .order('alamat', { ascending: true });

  if (rtFilter) {
    keluargaQuery = keluargaQuery.eq('rt', rtFilter);
  }

  if (statusFilter) {
    keluargaQuery = keluargaQuery.eq('status_keluarga', statusFilter);
  }

  const { data: keluargaRows, error: keluargaError } = await keluargaQuery;

  if (keluargaError || !keluargaRows) {
    console.error('[getKeluargaList:keluarga]', keluargaError);
    return { rows: [], total: 0 };
  }

  if (keluargaRows.length === 0) {
    return { rows: [], total: 0 };
  }

  const keluargaIds = keluargaRows.map((row) => row.id);
  const kepalaIds = keluargaRows
    .map((row) => row.kepala_keluarga_id)
    .filter((id): id is number => id !== null);

  // 2) Ambil seluruh warga yang terhubung ke keluarga-keluarga tersebut
  const { data: anggotaRows, error: anggotaError } = await supabase
    .from('warga-rw14')
    .select(
      `
      id,
      nama,
      keluarga_id,
      status_dalam_keluarga,
      jenis_kelamin,
      tahun_kelahiran,
      status_warga,
      asal_rt_domisili,
      alamat
    `
    )
    .eq('is_deleted', false)
    .in('keluarga_id', keluargaIds)
    .order('nama', { ascending: true });

  if (anggotaError) {
    console.error('[getKeluargaList:anggota]', anggotaError);
  }


  // 3) Map anggota per keluarga
  const anggotaMap = new Map<string, KeluargaAnggotaRow[]>();

  for (const row of anggotaRows ?? []) {
    if (!row.keluarga_id) continue;

    const list = anggotaMap.get(row.keluarga_id) ?? [];
    list.push({
      id: row.id,
      nama: row.nama,
      status_dalam_keluarga: row.status_dalam_keluarga,
      jenis_kelamin: row.jenis_kelamin,
      tahun_kelahiran: row.tahun_kelahiran,
      status_warga: row.status_warga,
      asal_rt_domisili: row.asal_rt_domisili,
      alamat: row.alamat,
    });
    anggotaMap.set(row.keluarga_id, list);
  }

  // 4) Map nama kepala keluarga
  let kepalaMap = new Map<number, string>();

  if (kepalaIds.length > 0) {
    const { data: kepalaRows, error: kepalaError } = await supabase
      .from('warga-rw14')
      .select('id, nama')
      .in('id', kepalaIds);

    if (kepalaError) {
      console.error('[getKeluargaList:kepala]', kepalaError);
    } else if (kepalaRows) {
      kepalaMap = new Map(kepalaRows.map((row) => [row.id, row.nama]));
    }
  }

  // 5) Bentuk row final
  let rows: KeluargaListRow[] = keluargaRows.map((keluarga) => {
  const anggota = (anggotaMap.get(keluarga.id) ?? []).sort((a, b) => {
    const order: Record<string, number> = {
      'Kepala Keluarga': 1,
      Suami: 2,
      Istri: 3,
      Anak: 4,
      'Orang Tua': 5,
      Saudara: 6,
      Lainnya: 7,
    };

    const aOrder = order[a.status_dalam_keluarga ?? 'Lainnya'] ?? 999;
    const bOrder = order[b.status_dalam_keluarga ?? 'Lainnya'] ?? 999;

    return aOrder - bOrder;
  });

  return {
    id: keluarga.id,
    nama_keluarga: keluarga.nama_keluarga,
    kepala_keluarga_id: keluarga.kepala_keluarga_id,
    kepala_keluarga_nama: keluarga.kepala_keluarga_id
      ? kepalaMap.get(keluarga.kepala_keluarga_id) ?? null
      : null,
    rt: keluarga.rt,
    alamat: keluarga.alamat,
    status_keluarga: keluarga.status_keluarga,
    jumlah_anggota: anggota.length,
    created_at: keluarga.created_at,
    anggota,
  };
});

  // 6) Filter anggota (1, 2-4, 5+)
  if (anggotaFilter.min !== undefined || anggotaFilter.max !== undefined) {
    rows = rows.filter((row) => {
      if (
        anggotaFilter.min !== undefined &&
        row.jumlah_anggota < anggotaFilter.min
      ) {
        return false;
      }
      if (
        anggotaFilter.max !== undefined &&
        row.jumlah_anggota > anggotaFilter.max
      ) {
        return false;
      }
      return true;
    });
  }

  const total = rows.length;

  // 7) Pagination
  const start = (currentPage - 1) * KELUARGA_PAGE_SIZE;
  const end = start + KELUARGA_PAGE_SIZE;

  return {
    rows: rows.slice(start, end),
    total,
  };
}

export async function getAvailableWarga(
  session: UserSession
): Promise<AvailableWargaRow[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('warga-rw14')
    .select(`
      id,
      nama,
      asal_rt_domisili,
      alamat,
      status_warga
    `)
    .eq('is_deleted', false)
    .is('keluarga_id', null)
    .eq('status_warga', 'Aktif')
    .order('nama', { ascending: true });

  if (session.role === 'RT') {
    query = query.eq('asal_rt_domisili', getSessionRT(session));
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error('[getAvailableWarga]', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    nama: row.nama,
    rt: row.asal_rt_domisili ?? '',
    alamat: row.alamat,
    status_warga: row.status_warga,
  }));
}