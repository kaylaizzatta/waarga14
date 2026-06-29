'use server';

import { revalidatePath } from 'next/cache';
import { softDeleteWarga } from '@/lib/warga-service';
import { getSession } from '@/lib/session';
import { createAuditLog } from '@/lib/audit-service';
import { getWargaById } from '@/lib/warga-service';

export async function deleteWargaAction(
  id: number,
  statusWarga: 'Pindah' | 'Meninggal' | 'Arsip'
) {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const warga = await getWargaById(id);

  if (!warga) {
    throw new Error(
      'Data warga tidak ditemukan'
    );
  }

  const success = await softDeleteWarga(id, statusWarga);

  if (!success) {
    throw new Error(
      'Gagal menghapus warga'
    );
  }

  await createAuditLog({
    akunId: session.id,
    action: 'DELETE',
    entity: 'warga',
    entityId: id,
    description: `Menghapus data warga ${warga.nama}`,
    oldData: warga,
    newData: { status_warga: statusWarga, is_deleted: true,},
  });

  revalidatePath('/dashboard/data-warga');
}