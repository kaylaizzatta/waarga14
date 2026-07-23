'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function submitLinkWargaToKeluarga(
  formData: FormData
) {
  const keluargaId = formData.get('keluargaId') as string;
  const wargaId = Number(formData.get('wargaId'));
  const statusDalamKeluarga = formData.get(
    'statusDalamKeluarga'
  ) as string;

  if (!keluargaId || !wargaId) {
    return {
      success: false,
      error: 'Data tidak lengkap.',
    };
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('warga-rw14')
    .update({
      keluarga_id: keluargaId,
      status_dalam_keluarga: statusDalamKeluarga,
    })
    .eq('id', wargaId);

  if (error) {
    console.error(error);

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

export async function submitUnlinkWargaFromKeluarga(
  formData: FormData
) {
  const wargaId = Number(formData.get('wargaId'));

  if (!wargaId) {
    return {
      success: false,
      error: 'ID warga tidak valid.',
    };
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('warga-rw14')
    .update({
      keluarga_id: null,
      status_dalam_keluarga: null,
    })
    .eq('id', wargaId);

  if (error) {
    console.error(error);

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

export async function updateKeluarga(
  formData: FormData
) {
  const keluargaId = String(
    formData.get('keluargaId') ?? ''
  );

  const namaKeluarga = String(
    formData.get('namaKeluarga') ?? ''
  ).trim();

  const alamat = String(
    formData.get('alamat') ?? ''
  ).trim();

  const statusKeluarga = String(
    formData.get('statusKeluarga') ?? ''
  ).trim();

  const kepalaKeluargaId = Number(
    formData.get('kepalaKeluargaId')
  );

  if (!keluargaId) {
    return {
      success: false,
      error: 'ID keluarga tidak valid.',
    };
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('keluarga')
    .update({
      nama_keluarga: namaKeluarga,
      alamat,
      status_keluarga: statusKeluarga,
      kepala_keluarga_id: kepalaKeluargaId,
    })
    .eq('id', keluargaId);

  if (error) {
    console.error(error);

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

export async function createKeluargaAction(
  formData: FormData
) {

}