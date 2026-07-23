"use client";

import { Trash2 } from "lucide-react";
import type { Member } from "./MemberSection";

type MemberCardProps = {
  member: Member;
  index: number;
  onRemove: () => void;
  onChange: (
    id: string,
    field: keyof Member,
    value: string
  ) => void;
};

const STATUS_OPTIONS = [
  "Suami",
  "Istri",
  "Anak",
  "Orang Tua",
  "Menantu",
  "Saudara",
];

const AGAMA_OPTIONS = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
];

export default function MemberCard({
  member,
  index,
  onRemove,
  onChange,
}: MemberCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            {member.status}
          </h3>

          <p className="text-sm text-slate-500">
            Anggota ke-{index + 1}
          </p>

        </div>

        {index !== 0 && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-xl p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        )}

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-medium">
            Status Dalam Keluarga
          </label>

          {index === 0 ? (
            <input
              value="Kepala Keluarga"
              disabled
              className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3"
            />
          ) : (
            <select
              value={member.status}
              onChange={(e) =>
                onChange(
                  member.id,
                  "status",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          )}

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Nama Lengkap
          </label>

          <input
            value={member.nama}
            onChange={(e) =>
              onChange(
                member.id,
                "nama",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Tahun Lahir
          </label>

          <input
            value={member.tahunKelahiran}
            onChange={(e) =>
              onChange(
                member.id,
                "tahunKelahiran",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Jenis Kelamin
          </label>

          <select
            value={member.jenisKelamin}
            onChange={(e) =>
              onChange(
                member.id,
                "jenisKelamin",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">
              Pilih
            </option>

            <option value="Laki-laki">
              Laki-laki
            </option>

            <option value="Perempuan">
              Perempuan
            </option>

          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Agama
          </label>

          <select
            value={member.agama}
            onChange={(e) =>
              onChange(
                member.id,
                "agama",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">
              Pilih
            </option>

            {AGAMA_OPTIONS.map((agama) => (
              <option
                key={agama}
                value={agama}
              >
                {agama}
              </option>
            ))}

          </select>

        </div>

      </div>

    </div>
  );
}