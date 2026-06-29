import TambahWargaForm from './TambahWargaForm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function TambahWargaPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <TambahWargaForm
      role={session.role}
      rtDikelola={session.rt_dikelola}
    />
  );
}