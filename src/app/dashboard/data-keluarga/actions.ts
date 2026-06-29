'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import {
  linkWargaToKeluarga,
  unlinkWargaFromKeluarga,
} from '@/lib/keluarga-service';

export async function submitLinkWargaToKeluarga(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Session tidak ditemukan.' };
  }

  const keluargaId = String(formData.get('keluargaId') ?? '');
  const wargaId = Number(formData.get('wargaId') ?? 0);
  const statusDalamKeluarga = String(
    formData.get('statusDalamKeluarga') ?? ''
  );

  if (!keluargaId) {
    return { success: false, error: 'ID keluarga tidak valid.' };
  }

  if (!wargaId || Number.isNaN(wargaId)) {
    return { success: false, error: 'ID warga tidak valid.' };
  }

  const result = await linkWargaToKeluarga(
    keluargaId,
    wargaId,
    statusDalamKeluarga,
    session
  );

  if (result.success) {
    revalidatePath('/dashboard/data-keluarga');
  }

  return result;
}

export async function submitUnlinkWargaFromKeluarga(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Session tidak ditemukan.' };
  }

  const keluargaId = String(formData.get('keluargaId') ?? '');
  const wargaId = Number(formData.get('wargaId') ?? 0);

  if (!keluargaId) {
    return { success: false, error: 'ID keluarga tidak valid.' };
  }

  if (!wargaId || Number.isNaN(wargaId)) {
    return { success: false, error: 'ID warga tidak valid.' };
  }

  const result = await unlinkWargaFromKeluarga(keluargaId, wargaId, session);

  if (result.success) {
    revalidatePath('/dashboard/data-keluarga');
  }

  return result;
}