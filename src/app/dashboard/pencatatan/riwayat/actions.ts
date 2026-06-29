'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function deleteAuditAction(id: number) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('audit_logs')
    .delete()
    .eq('id', id);

  if (error) {
  console.error('[deleteAuditAction FULL]', error);

    throw new Error(
        JSON.stringify(error, null, 2)
    );
    }

  revalidatePath('/dashboard/riwayat');
}