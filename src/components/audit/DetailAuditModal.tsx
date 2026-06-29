'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface Props {
  log: any | null;
  onClose: () => void;
}

export default function DetailAuditModal({
  log,
  onClose,
}: Props) {
  const isOpen = log !== null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!log) return null;

  const oldData = log.old_data ?? {};
  const newData = log.new_data ?? {};

  const changedFields = Object.keys(newData).filter(
    (key) =>
      JSON.stringify(oldData[key]) !==
      JSON.stringify(newData[key])
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="
          fixed inset-0 z-40
          bg-black/20
          backdrop-blur-[2px]
        "
      />

      {/* Drawer */}
      <aside
        className="
          fixed right-0 top-0 bottom-0 z-50
          w-full max-w-[520px]
          bg-white
          shadow-2xl
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Detail Perubahan
            </p>

            <p className="text-xs text-slate-400 mt-0.5">
              Audit Log
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup"
            className="
              w-8 h-8 rounded-xl
              flex items-center justify-center
              text-slate-400
              hover:bg-slate-100
              hover:text-slate-600
            "
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Ringkasan */}
          <div className="p-6 border-b border-slate-100 bg-slate-50">

            <div className="flex items-center gap-2">

              <span
                className={
                  log.action === 'CREATE'
                    ? 'px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : log.action === 'UPDATE'
                    ? 'px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'px-2 py-1 rounded-full text-xs bg-red-50 text-red-700 border border-red-200'
                }
              >
                {log.action}
              </span>

            </div>

            <p className="mt-3 text-sm font-medium text-slate-800">
              {log.description}
            </p>

          </div>

          {/* Aktivitas */}
          <div className="p-6 border-b border-slate-100">

            <p className="text-xs font-bold tracking-wide text-slate-400 uppercase mb-4">
              Informasi Aktivitas
            </p>

            <div className="space-y-3 text-sm">

              <Info
                label="Pengguna"
                value={log.akun?.nama ?? '-'}
              />

              <Info
                label="Role"
                value={log.akun?.role ?? '-'}
              />

              <Info
                label="Waktu"
                value={new Date(
                  log.created_at
                ).toLocaleString('id-ID')}
              />

            </div>

          </div>

          {/* Perubahan */}
          <div className="p-6">

            <p className="text-xs font-bold tracking-wide text-slate-400 uppercase mb-4">
              Perubahan Data
            </p>

            {changedFields.length === 0 ? (
              <p className="text-sm text-slate-400">
                Tidak ada perubahan data yang terdeteksi.
              </p>
            ) : (
              <div className="space-y-5">

                {changedFields.map((field) => (
                  <div
                    key={field}
                    className="border rounded-xl p-4"
                  >
                    <p className="font-semibold text-slate-800 mb-3">
                      {FIELD_LABELS[field] ?? field}
                    </p>

                    <div className="space-y-2 text-sm">

                      <div>
                        <p className="text-red-500 text-xs font-medium">
                          Data Lama
                        </p>

                        <p className="text-slate-700">
                          {String(
                            oldData[field] ?? '-'
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-emerald-600 text-xs font-medium">
                          Data Baru
                        </p>

                        <p className="text-slate-700">
                          {String(
                            newData[field] ?? '-'
                          )}
                        </p>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4">

          <Link
            href={`/dashboard/data-warga?id=${log.entity_id}`}
            className="
              w-full inline-flex justify-center
              px-4 py-2.5
              rounded-xl
              bg-indigo-600
              text-white
              text-sm
              font-medium
            "
          >
            Lihat Data Warga
          </Link>

        </div>

      </aside>
    </>
  );
}

const FIELD_LABELS: Record<string, string> = {
  nama: 'Nama',
  alamat: 'Alamat',
  asal_rt_domisili: 'RT Domisili',
  status_dalam_keluarga: 'Status Keluarga',
  tahun_kelahiran: 'Tahun Kelahiran',
  jenis_kelamin: 'Jenis Kelamin',
  tingkat_pendidikan_terakhir: 'Pendidikan Terakhir',
  jenis_pekerjaan: 'Pekerjaan',
  status_perkawinan: 'Status Perkawinan',
  status_kepemilikan_rumah: 'Kepemilikan Rumah',
  status_penerimaan_bantuan: 'Status Bantuan',
  jenis_bpjs_kesehatan: 'BPJS Kesehatan',
  agama: 'Agama',
};

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="text-slate-700">
        {value}
      </p>
    </div>
  );
}