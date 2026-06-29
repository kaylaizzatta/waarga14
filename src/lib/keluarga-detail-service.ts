import { createServerSupabaseClient } from './supabase-server';
import { mapUsernameToRT } from './rt-utils';
import type { UserSession } from './types';

export interface KeluargaDetail {
  id: string;
  nama_keluarga: string;
  kepala_keluarga_id: number | null;
  kepala_keluarga_nama: string | null;
  rt: string;
  alamat: string;
  status_keluarga: string;
  catatan: string | null;
  created_at: string;
  updated_at: string;
  jumlah_anggota: number;
}

export interface AnggotaKeluargaRow {
  id: number;
  nama: string;
  status_dalam_keluarga: string | null;
  jenis_kelamin: string | null;
  tahun_kelahiran: number | null;
  status_warga: string | null;
  asal_rt_domisili: string | null;
  alamat: string | null;
}

function normalizeRT(value: string | null | undefined): string {
  return (value ?? '').trim().toUpperCase();
}

function canAccessRT(session: UserSession, rtKeluarga: string): boolean {
  if (session.role === 'RW') return true;

  const rtSession = normalizeRT(mapUsernameToRT(session.username));
  const rtData = normalizeRT(rtKeluarga);

  return rtSession !== '' && rtSession === rtData;
}

export async function getKeluargaDetailById(
  keluargaId: string,
  session: UserSession
): Promise<KeluargaDetail | null> {
  const supabase = createServerSupabaseClient();

  // 1) Ambil data keluarga
  const { data: keluarga, error: keluargaError } = await supabase
    .from('keluarga')
    .select(`
      id,
      nama_keluarga,
      kepala_keluarga_id,
      rt,
      alamat,
      status_keluarga,
      catatan,
      created_at,
      updated_at
    `)
    .eq('id', keluargaId)
    .single();

  if (keluargaError || !keluarga) {
    console.error('[getKeluargaDetailById:keluarga]', {
      message: keluargaError?.message,
      details: keluargaError?.details,
      hint: keluargaError?.hint,
      code: keluargaError?.code,
    });
    return null;
  }

  // 2) Cek akses RT
  if (!canAccessRT(session, keluarga.rt)) {
    return null;
  }

  // 3) Ambil nama kepala keluarga
  let kepalaNama: string | null = null;

  if (keluarga.kepala_keluarga_id) {
    const { data: kepala, error: kepalaError } = await supabase
      .from('warga-rw14')
      .select('id, nama')
      .eq('id', keluarga.kepala_keluarga_id)
      .single();

    if (kepalaError) {
      console.error('[getKeluargaDetailById:kepala]', {
        message: kepalaError.message,
        details: kepalaError.details,
        hint: kepalaError.hint,
        code: kepalaError.code,
      });
    } else {
      kepalaNama = kepala?.nama ?? null;
    }
  }

  // 4) Hitung jumlah anggota keluarga
  const { count: jumlahAnggota, error: anggotaCountError } = await supabase
    .from('warga-rw14')
    .select('*', { count: 'exact', head: true })
    .eq('keluarga_id', keluargaId)
    .eq('is_deleted', false);

  if (anggotaCountError) {
    console.error('[getKeluargaDetailById:anggotaCount]', {
      message: anggotaCountError.message,
      details: anggotaCountError.details,
      hint: anggotaCountError.hint,
      code: anggotaCountError.code,
    });
  }

  return {
    id: keluarga.id,
    nama_keluarga: keluarga.nama_keluarga,
    kepala_keluarga_id: keluarga.kepala_keluarga_id,
    kepala_keluarga_nama: kepalaNama,
    rt: keluarga.rt,
    alamat: keluarga.alamat,
    status_keluarga: keluarga.status_keluarga,
    catatan: keluarga.catatan,
    created_at: keluarga.created_at,
    updated_at: keluarga.updated_at,
    jumlah_anggota: jumlahAnggota ?? 0,
  };
}

export async function getAnggotaKeluarga(
  keluargaId: string,
  session: UserSession
): Promise<AnggotaKeluargaRow[]> {
  const supabase = createServerSupabaseClient();

  // Ambil dulu data keluarga untuk validasi akses RT
  const { data: keluarga, error: keluargaError } = await supabase
    .from('keluarga')
    .select('id, rt')
    .eq('id', keluargaId)
    .single();

  if (keluargaError || !keluarga) {
    console.error('[getAnggotaKeluarga:cekKeluarga]', {
      message: keluargaError?.message,
      details: keluargaError?.details,
      hint: keluargaError?.hint,
      code: keluargaError?.code,
    });
    return [];
  }

  if (!canAccessRT(session, keluarga.rt)) {
    return [];
  }

  const { data, error } = await supabase
    .from('warga-rw14')
    .select(`
      id,
      nama,
      status_dalam_keluarga,
      jenis_kelamin,
      tahun_kelahiran,
      status_warga,
      asal_rt_domisili,
      alamat
    `)
    .eq('keluarga_id', keluargaId)
    .eq('is_deleted', false)
    .order('id', { ascending: true });

  if (error || !data) {
    console.error('[getAnggotaKeluarga]', {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
    });
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    nama: row.nama,
    status_dalam_keluarga: row.status_dalam_keluarga,
    jenis_kelamin: row.jenis_kelamin,
    tahun_kelahiran: row.tahun_kelahiran,
    status_warga: row.status_warga,
    asal_rt_domisili: row.asal_rt_domisili,
    alamat: row.alamat,
  }));
}