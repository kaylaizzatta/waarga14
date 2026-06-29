import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from './constants';
import type { UserSession } from './types';

const COOKIE_OPTIONS = {
  httpOnly: true,                                          // Tidak bisa dibaca JS browser
  secure: process.env.NODE_ENV === 'production',           // HTTPS only di production
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24,                                   // 24 jam
  path: '/',
};

/**
 * Simpan session ke httpOnly cookie.
 * Dipanggil setelah verifikasi login berhasil.
 */
export async function setSession(session: UserSession): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, JSON.stringify(session), COOKIE_OPTIONS);
}

/**
 * Hapus session cookie.
 * Dipanggil saat logout.
 */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

/**
 * Baca dan parse session dari cookie.
 * Mengembalikan null jika tidak ada atau cookie tidak valid.
 */
export async function getSession(): Promise<UserSession | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}