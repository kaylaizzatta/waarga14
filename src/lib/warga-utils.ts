/**
 * Utility client-safe untuk halaman Data Warga.
 * File ini TIDAK boleh mengimport modul server (supabase-server, next/headers, dll).
 * Dipakai oleh DataWargaFilters dan DataWargaPagination.
 */

/** Representasi seluruh filter aktif sebagai URL params */
export interface WargaURLParams {
  search:     string;   // pencarian nama
  alamat:     string;   // pencarian alamat
  rt:         string;   // filter RT (kosong = semua)
  status:     string;   // filter status_dalam_keluarga
  gender:     string;   // filter jenis_kelamin
  pendidikan: string;   // filter tingkat_pendidikan_terakhir
  pekerjaan:  string;   // filter jenis_pekerjaan
  bpjs:          string;  // 
  statusBantuan: string;  // 
  statusWarga: string;
}

export const EMPTY_WARGA_URL_PARAMS: WargaURLParams = {
  search: '', alamat: '', rt: '',
  status: '', gender: '', pendidikan: '', pekerjaan: '',
  bpjs:   '', statusBantuan: '', statusWarga: '',
};

/**
 * Bangun URL halaman Data Warga dengan semua filter + pagination.
 * Dipakai di DataWargaFilters (navigasi filter) dan DataWargaPagination (ganti halaman).
 */
export function buildWargaURL(
  pathname: string,
  params: WargaURLParams,
  page?: number
): string {
  const sp = new URLSearchParams();

  if (params.search.trim())  sp.set('search',     params.search.trim());
  if (params.alamat.trim())  sp.set('alamat',      params.alamat.trim());
  if (params.rt)             sp.set('rt',          params.rt);
  if (params.status)         sp.set('status',      params.status);
  if (params.gender)         sp.set('gender',      params.gender);
  if (params.pendidikan)     sp.set('pendidikan',  params.pendidikan);
  if (params.pekerjaan)      sp.set('pekerjaan',   params.pekerjaan);
  if (params.bpjs)           sp.set('bpjs',     params.bpjs);       
  if (params.statusBantuan)  sp.set('statusBantuan',  params.statusBantuan);
  if (page && page > 1)      sp.set('page',        String(page));
  if (params.statusWarga)    sp.set('statusWarga', params.statusWarga);

  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/** Hitung jumlah filter yang aktif (diisi pengguna) */
export function countActiveFilters(params: WargaURLParams, excludeRT = false): number {
  return [
    params.search.trim(),
    params.alamat.trim(),
    excludeRT ? '' : params.rt,
    params.status,
    params.gender,
    params.pendidikan,
    params.pekerjaan,
    params.bpjs,
    params.statusBantuan,
    params.statusWarga,
  ].filter(Boolean).length;
}