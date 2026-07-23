'use client';

import { useState } from 'react';
import type { KeluargaListRow } from '@/lib/keluarga-service';
import { updateKeluarga } from '@/actions/keluarga-actions';
import { useRouter } from 'next/navigation';

interface Props {
  keluarga: KeluargaListRow;
  onClose: () => void;
}

export default function EditKeluargaPanel({
  keluarga,
  onClose,
}: Props) {
  const [namaKeluarga, setNamaKeluarga] = useState(
    keluarga.nama_keluarga
  );

  const [alamat, setAlamat] = useState(
    keluarga.alamat
  );

  const [statusKeluarga, setStatusKeluarga] = useState(
    keluarga.status_keluarga
  );

  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    try {
      setIsSaving(true);

      const formData = new FormData();

      formData.append('keluargaId', keluarga.id);
      formData.append('namaKeluarga', namaKeluarga);
      formData.append('alamat', alamat);
      formData.append('statusKeluarga', statusKeluarga);
      formData.append(
        'kepalaKeluargaId',
        String(keluarga.kepala_keluarga_id ?? '')
      );

      const result = await updateKeluarga(formData);

      if (!result.success) {
        alert(result.error);
        return;
      }

      alert('Data keluarga berhasil diperbarui.');

      router.refresh();
      onClose();

    } finally {
      setIsSaving(false);
    }
  }



  return (
    <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-8 shadow-lg">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Edit Data Keluarga
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Perbarui informasi keluarga di bawah ini.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Nama Keluarga
          </label>

          <input
            value={namaKeluarga}
            onChange={(e) => setNamaKeluarga(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3
            text-slate-800
            outline-none transition
            focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            value={statusKeluarga}
            onChange={(e) => setStatusKeluarga(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Alamat
          </label>

          <input
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3
            text-slate-800 placeholder:text-slate-400
            outline-none transition
            focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

      </div>

      <div className="mt-8 flex justify-end gap-3">

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>

      </div>
    </div>
  );
}