'use client';

import MemberCard from './MemberCard';
import { AnggotaForm } from './types';

interface Props {
  members: AnggotaForm[];

  onChange: (
    id: string,
    field: keyof AnggotaForm,
    value: string
  ) => void;

  onDelete: (id: string) => void;
}

export default function MemberList({
  members,
  onChange,
  onDelete,
}: Props) {

  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

        <h3 className="text-lg font-semibold text-slate-700">
          Belum ada anggota keluarga
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Klik tombol <b>Tambah Anggota</b> untuk menambahkan istri atau anak.
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {members.map((member, index) => (

        <MemberCard
          key={member.id}
          member={member}
          index={index}
          onChange={onChange}
          onDelete={onDelete}
        />

      ))}

    </div>
  );
}