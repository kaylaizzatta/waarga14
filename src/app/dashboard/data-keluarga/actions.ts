'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function deleteKeluarga(keluargaId: string) {
  const supabase = createServerSupabaseClient();

  // Pastikan keluarga benar-benar kosong
  const { count } = await supabase
    .from('warga-rw14')
    .select('*', {
      head: true,
      count: 'exact',
    })
    .eq('keluarga_id', keluargaId);

  if ((count ?? 0) > 0) {
    return {
      success: false,
      error: 'Keluarga masih memiliki anggota.',
    };
  }

  const { error } = await supabase
    .from('keluarga')
    .delete()
    .eq('id', keluargaId);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/dashboard/data-keluarga');

  return {
    success: true,
  };

  
}