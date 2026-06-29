'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { setSession, clearSession } from '@/lib/session'; // ← getSession TIDAK diimport di sini
import type { AkunRow, LoginState } from '@/lib/types';

// ✂️ DIHAPUS: export { getSession }
// getSession sekarang diimport langsung dari @/lib/session di dashboard/page.tsx

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = (formData.get('username') as string | null)?.trim() ?? '';
  const password = (formData.get('password') as string | null) ?? '';

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' };
  }

  const supabase = createServerSupabaseClient();

  const { data, error: dbError } = await supabase
    .from('akun')
    .select(`
      id,
      username,
      password,
      role,
      nama,
      rt_dikelola
    `)
    .eq('username', username)
    .maybeSingle();

  if (dbError) {
    console.error('[loginAction] Supabase error:', dbError.message);
    return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
  }

  if (!data || (data as AkunRow).password !== password) {
    return { error: 'Username atau password salah.' };
  }

  const account = data as AkunRow;

  await setSession({
  id: account.id,
  username: account.username,
  role: account.role,
  rt_dikelola: account.rt_dikelola,
  });

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect('/login');
}