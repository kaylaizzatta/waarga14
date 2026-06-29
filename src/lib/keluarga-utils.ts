export interface KeluargaURLParams {
  rt?: string;
  anggota?: string;
  status?: string;
}

export function buildKeluargaURL(
  pathname: string,
  params: KeluargaURLParams,
  page?: number
) {
  const searchParams = new URLSearchParams();

  if (params.rt) searchParams.set('rt', params.rt);
  if (params.anggota) searchParams.set('anggota', params.anggota);
  if (params.status) searchParams.set('status', params.status);
  if (page && page > 1) searchParams.set('page', String(page));

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}