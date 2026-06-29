import { notFound } from 'next/navigation';
import { getWargaById } from '@/lib/warga-service';
import { getSession } from '@/lib/session';
import PerbaruiWargaForm from './PerbaruiWargaForm';

export default async function PerbaruiWargaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    notFound();
  }

  const { id } = await params;

  const warga = await getWargaById(Number(id));

  if (!warga) {
    notFound();
  }

  // RT hanya boleh mengakses warga milik RT-nya
  if (
    session.role === 'RT' &&
    warga.asal_rt_domisili !== session.rt_dikelola
  ) {
    notFound();
  }

  return <PerbaruiWargaForm warga={warga} />;
}