'use client';

import type {
  KeluargaAnggotaRow,
} from '@/lib/keluarga-service';

import AnggotaRow from './AnggotaRow';

interface Props {
  anggota: KeluargaAnggotaRow[];
  keluargaId: string;
}

export default function AnggotaTable({
  anggota,
  keluargaId,
}: Props) {

  if (anggota.length === 0) {
    return (
      <div className="px-5 py-8 text-sm text-slate-500">
        Belum ada anggota keluarga yang terhubung.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">

      <table className="min-w-full border-collapse">

        <thead className="bg-slate-50">

          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

            <th className="px-5 py-3">
              Nama
            </th>

            <th className="px-5 py-3">
              Status Keluarga
            </th>

            <th className="px-5 py-3">
              Jenis Kelamin
            </th>

            <th className="px-5 py-3">
              Tahun Lahir
            </th>

            <th className="px-5 py-3">
              Status Warga
            </th>

            <th className="px-5 py-3">
              RT Domisili
            </th>

            <th className="px-5 py-3">
              Alamat
            </th>

            <th className="px-5 py-3">
              Aksi
            </th>

          </tr>

        </thead>

        <tbody>

          {anggota.map((person) => (

            <AnggotaRow
              key={person.id}
              person={person}
              keluargaId={keluargaId}
            />

          ))}

        </tbody>

      </table>

    </div>
  );
}