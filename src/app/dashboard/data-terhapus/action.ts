'use server';

import { revalidatePath } from 'next/cache';

import { restoreWarga } from '@/lib/warga-service';
import { getSession } from '@/lib/session';
import { createAuditLog } from '@/lib/audit-service';
import { getDeletedWargaById } from '@/lib/warga-service';

export async function restoreWargaAction(
  id: number
) {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const warga = await getDeletedWargaById(id);

  const success = await restoreWarga(id);

  if (!success) {
    throw new Error(
      'Gagal restore warga'
    );
  }

  await createAuditLog({
    akunId: session.id,
    action: 'RESTORE',
    entity: 'warga',
    entityId: id,
    description: `Restore data warga ${warga?.nama}`,
    oldData: null,
    newData: warga,
  });

  revalidatePath('/dashboard/data-warga');
  revalidatePath('/dashboard/data-terhapus');
  revalidatePath('/dashboard/riwayat');
}