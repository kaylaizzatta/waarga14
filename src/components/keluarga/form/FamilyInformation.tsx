'use client';

import { InformasiKeluargaForm } from './types';
import { RT_OPTIONS } from './constants';

interface Props {
  value: InformasiKeluargaForm;
  onChange: (value: InformasiKeluargaForm) => void;

  role: 'RW' | 'RT';
  rtDikelola: string | null;
}

export default function FamilyInformation({
  value,
  onChange,
  role,
  rtDikelola,
}: Props) {
  function update<K extends keyof InformasiKeluargaForm>(
    key: K,
    val: InformasiKeluargaForm[K]
  ) {
    onChange({
      ...value,
      [key]: val,
    });
  }

  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        overflow-hidden
      "
    >
      {/* Header */}

      <div className="border-b border-slate-200 px-6 py-5">

        <h2 className="text-xl font-bold text-slate-900">
          Informasi Keluarga
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Masukkan informasi dasar mengenai domisili keluarga.
        </p>

      </div>

      {/* Body */}

      <div className="grid gap-6 p-6 md:grid-cols-2">

        {/* RT */}

        <div>

          <label className="text-sm font-semibold text-slate-800">
            RT Domisili
          </label>

          {role === "RW" ? (
            <select
              value={value.rt}
              onChange={(e) => update("rt", e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                text-slate-900
                font-medium
                transition
                outline-none
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-200
              "
            >
              <option
                value=""
                className="text-slate-500"
              >
                -- Pilih RT --
              </option>

              {RT_OPTIONS.map((rt) => (
                <option
                  key={rt}
                  value={rt}
                  className="text-slate-900"
                >
                  {rt}
                </option>
              ))}
            </select>
          ) : (
            <input
              readOnly
              value={rtDikelola ?? ""}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-slate-100
                px-4
                py-3
                font-medium
                text-slate-700
              "
            />
          )}

        </div>

        {/* Spacer */}

        <div />

        {/* Alamat */}

        <div className="md:col-span-2">

          <label className="text-sm font-semibold text-slate-800">
            Alamat Lengkap
          </label>

          <textarea
            rows={4}
            placeholder="Contoh: Blok D17 No.98"
            value={value.alamat}
            onChange={(e)=>update("alamat",e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              py-3
              text-slate-900
              font-medium
              placeholder:text-slate-400
              outline-none
              resize-none
              transition
              focus:border-violet-500
              focus:ring-2
              focus:ring-violet-200
            "
          />

          <p className="mt-2 text-xs text-slate-500">
            Gunakan alamat domisili yang digunakan keluarga saat ini.
          </p>

        </div>

      </div>

    </section>
  );
}