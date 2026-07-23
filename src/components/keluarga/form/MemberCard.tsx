'use client';

import { AnggotaForm } from './types';
import {
  AGAMA_OPTIONS,
  JENIS_KELAMIN_OPTIONS,
  PENDIDIKAN_OPTIONS,
  PEKERJAAN_OPTIONS,
  STATUS_BANTUAN_OPTIONS,
  STATUS_DALAM_KELUARGA_OPTIONS,
  STATUS_KEPEMILIKAN_RUMAH_OPTIONS,
  STATUS_PERKAWINAN_OPTIONS,
} from './constants';

interface Props {
  member: AnggotaForm;
  index: number;

  onChange: (
    id: string,
    field: keyof AnggotaForm,
    value: string
  ) => void;

  onDelete: (id: string) => void;
}

export default function MemberCard({
  member,
  index,
  onChange,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            {member.statusDalamKeluarga || `Anggota ${index + 1}`}
          </h3>

          <p className="text-sm text-slate-500">
            Data anggota keluarga
          </p>

        </div>

        <button
          type="button"
          onClick={() => onDelete(member.id)}
          className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-semibold tracking-wide text-red-600 hover:bg-red-100"
          >
          Hapus
        </button>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        <Field
          label="Status Dalam Keluarga"
        >
          <Select
            value={member.statusDalamKeluarga}
            onChange={(e) =>
              onChange(
                member.id,
                'statusDalamKeluarga',
                e.target.value
              )
            }
          >
            {STATUS_DALAM_KELUARGA_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>

        <Field
          label="Nama"
        >
          <Input
            value={member.nama}
            onChange={(e) =>
              onChange(
                member.id,
                'nama',
                e.target.value
              )
            }
          />
        </Field>

        <Field
          label="Tahun Lahir"
        >
          <Input
            type="number"
            value={member.tahunKelahiran}
            onChange={(e) =>
              onChange(
                member.id,
                'tahunKelahiran',
                e.target.value
              )
            }
          />
        </Field>

        <Field
          label="Jenis Kelamin"
        >
          <Select
            value={member.jenisKelamin}
            onChange={(e) =>
              onChange(
                member.id,
                'jenisKelamin',
                e.target.value
              )
            }
          >
            {JENIS_KELAMIN_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>

        <Field label="Agama">
          <Select
            value={member.agama}
            onChange={(e) =>
              onChange(member.id, "agama", e.target.value)
            }
          >
            {AGAMA_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>

        <Field label="Status Perkawinan">
          <Select
            value={member.statusPerkawinan}
            onChange={(e) =>
              onChange(member.id, "statusPerkawinan", e.target.value)
            }
          >
            {STATUS_PERKAWINAN_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>

        <Field label="Pendidikan">
          <Select
            value={member.pendidikan}
            onChange={(e) =>
              onChange(member.id, "pendidikan", e.target.value)
            }
          >
            {PENDIDIKAN_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>

        <Field label="Pekerjaan">
          <Select
            value={member.pekerjaan}
            onChange={(e) =>
              onChange(member.id, "pekerjaan", e.target.value)
            }
          >
            {PEKERJAAN_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>

        <Field label="Status Bantuan">
          <Select
            value={member.statusBantuan}
            onChange={(e) =>
              onChange(member.id, "statusBantuan", e.target.value)
            }
          >
            {STATUS_BANTUAN_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>

        <Field label="Status Kepemilikan Rumah">
          <Select
            value={member.statusKepemilikanRumah}
            onChange={(e) =>
              onChange(member.id, "statusKepemilikanRumah", e.target.value)
            }
          >
            {STATUS_KEPEMILIKAN_RUMAH_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>

        

      </div>

    </div>
  );
}

/* ---------- UI ---------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold tracking-wide text-slate-600">
        {label}
      </label>

      {children}
    </div>
  );
}

function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-300 px-4 py-3"
    />
  );
}

function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-slate-300 px-4 py-3"
    />
  );
}