"use client";

import { useState } from "react";
import MemberCard from "./MemberCard";

export type Member = {
  id: string;
  status: string;
  nama: string;
  tahunKelahiran: string;
  jenisKelamin: string;
  agama: string;
};

export default function MemberSection() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: crypto.randomUUID(),
      status: "Kepala Keluarga",
      nama: "",
      tahunKelahiran: "",
      jenisKelamin: "",
      agama: "",
    },
  ]);

  function addMember() {
    setMembers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        status: "Anak",
        nama: "",
        tahunKelahiran: "",
        jenisKelamin: "",
        agama: "",
      },
    ]);
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function updateMember(
    id: string,
    field: keyof Member,
    value: string
  ) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              [field]: value,
            }
          : m
      )
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold">
            Anggota Keluarga
          </h2>

          <p className="text-sm text-slate-500">
            {members.length} Orang
          </p>

        </div>

        <button
          onClick={addMember}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          + Tambah Anggota
        </button>

      </div>

      <div className="mt-6 space-y-6">

        {members.map((member, index) => (

          <MemberCard
            key={member.id}
            member={member}
            index={index}
            onRemove={() => removeMember(member.id)}
            onChange={updateMember}
          />

        ))}

      </div>

    </div>
  );
}