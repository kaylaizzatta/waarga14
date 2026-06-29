/**
 * Peta username akun RT → nilai asal_rt_domisili di database.
 * Dipakai di warga-service.ts dan dashboard-service.ts.
 */
const RT_MAP: Record<string, string> = {
  rt01: 'RT 01',
  rt02: 'RT 02',
  rt03: 'RT 03',
  rt04: 'RT 04',
};

export function mapUsernameToRT(username: string): string {
  return RT_MAP[username.toLowerCase()] ?? username;
}