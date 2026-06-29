'use client';

import { useMemo, useState } from 'react';
import type {
  KeluargaListRow,
  KeluargaAnggotaRow,
  LinkableWargaRow,
} from '@/lib/keluarga-service';
import {
  submitLinkWargaToKeluarga,
  submitUnlinkWargaFromKeluarga,
} from '@/app/dashboard/data-keluarga/actions';

interface KeluargaTableProps {
  keluarga: KeluargaListRow[];
}

const STATUS_DALAM_KELUARGA_OPTIONS = [
  'Kepala Keluarga',
  'Istri',
  'Suami',
  'Anak',
  'Orang Tua',
  'Saudara',
  'Lainnya',
];

function StatusBadge({ status }: { status: string }) {
  const normalized = (status ?? '').toLowerCase();

  const styleMap: Record<string, string> = {
    aktif: 'bg-emerald-50 text-emerald-700',
    pindah: 'bg-amber-50 text-amber-700',
    nonaktif: 'bg-slate-100 text-slate-700',
    kosong: 'bg-rose-50 text-rose-700',
  };

  const className = styleMap[normalized] ?? 'bg-slate-100 text-slate-700';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status || '-'}
    </span>
  );
}

function GenderBadge({ gender }: { gender: string | null }) {
  const value = (gender ?? '').trim().toLowerCase();

  if (!value) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        -
      </span>
    );
  }

  const isLaki =
    value.includes('laki') || value === 'l' || value === 'male';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isLaki ? 'bg-sky-50 text-sky-700' : 'bg-pink-50 text-pink-700'
      }`}
    >
      {gender}
    </span>
  );
}

function StatusWargaBadge({ status }: { status: string | null }) {
  const value = (status ?? '').trim();

  if (!value) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        -
      </span>
    );
  }

  const normalized = value.toLowerCase();

  const styleMap: Record<string, string> = {
    aktif: 'bg-emerald-50 text-emerald-700',
    pindah: 'bg-amber-50 text-amber-700',
    meninggal: 'bg-rose-50 text-rose-700',
    nonaktif: 'bg-slate-100 text-slate-700',
  };

  const className = styleMap[normalized] ?? 'bg-slate-100 text-slate-700';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {value}
    </span>
  );
}

export default function KeluargaTable({ keluarga }: KeluargaTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [linkingId, setLinkingId] = useState<string | null>(null);

  const rows = useMemo(() => keluarga ?? [], [keluarga]);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function toggleLinking(id: string) {
    setLinkingId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">Daftar Keluarga</h2>
        <p className="mt-1 text-sm text-slate-500">
          Menampilkan keluarga beserta anggota warga yang terhubung di sistem.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4">Kepala Keluarga</th>
              <th className="px-6 py-4">RT</th>
              <th className="px-6 py-4">Alamat</th>
              <th className="px-6 py-4">Anggota</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  Belum ada data keluarga yang bisa ditampilkan.
                </td>
              </tr>
            ) : (
              rows.map((item) => {
                const anggota = item.anggota ?? [];
                const isExpanded = expandedId === item.id;
                const isLinking = linkingId === item.id;

                return (
                  <FragmentRow
                    key={item.id}
                    item={item}
                    anggota={anggota}
                    isExpanded={isExpanded}
                    isLinking={isLinking}
                    onToggleExpand={() => toggleExpand(item.id)}
                    onToggleLinking={() => toggleLinking(item.id)}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type FragmentRowProps = {
  item: KeluargaListRow;
  anggota: KeluargaAnggotaRow[];
  isExpanded: boolean;
  isLinking: boolean;
  onToggleExpand: () => void;
  onToggleLinking: () => void;
};

function FragmentRow({
  item,
  anggota,
  isExpanded,
  isLinking,
  onToggleExpand,
  onToggleLinking,
}: FragmentRowProps) {
  return (
    <>
      <tr className="border-t border-slate-100 text-sm text-slate-700">
        <td className="px-6 py-4 font-semibold text-slate-900">
          {item.kepala_keluarga_nama ?? item.nama_keluarga ?? '-'}
        </td>

        <td className="px-6 py-4">{item.rt}</td>

        <td className="px-6 py-4">{item.alamat}</td>

        <td className="px-6 py-4">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {item.jumlah_anggota} orang
          </span>
        </td>

        <td className="px-6 py-4">
          <StatusBadge status={item.status_keluarga} />
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onToggleExpand}
              className="text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              {isExpanded ? 'Sembunyikan anggota' : 'Lihat anggota'}
            </button>

            <button
              type="button"
              onClick={onToggleLinking}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              {isLinking ? 'Tutup tambah anggota' : 'Tambah anggota'}
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-t border-slate-100 bg-slate-50/60">
          <td colSpan={6} className="px-6 py-5">
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Anggota Keluarga
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Menampilkan warga yang terhubung ke keluarga ini.
                </p>
              </div>

              {anggota.length === 0 ? (
                <div className="px-5 py-8 text-sm text-slate-500">
                  Belum ada anggota keluarga yang terhubung.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-5 py-3">Nama</th>
                        <th className="px-5 py-3">Status Keluarga</th>
                        <th className="px-5 py-3">Jenis Kelamin</th>
                        <th className="px-5 py-3">Tahun Lahir</th>
                        <th className="px-5 py-3">Status Warga</th>
                        <th className="px-5 py-3">RT Domisili</th>
                        <th className="px-5 py-3">Alamat</th>
                        <th className="px-5 py-3">Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {anggota.map((person) => (
                        <AnggotaRow
                          key={person.id}
                          person={person}
                          keluargaId={item.id}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

      {isLinking && (
        <tr className="border-t border-slate-100 bg-emerald-50/40">
          <td colSpan={6} className="px-6 py-5">
            <LinkWargaPanel keluarga={item} />
          </td>
        </tr>
      )}
    </>
  );
}

function AnggotaRow({
  person,
  keluargaId,
}: {
  person: KeluargaAnggotaRow;
  keluargaId: string;
}) {
  const [isPending, setIsPending] = useState(false);

  async function handleUnlink() {
    if (!confirm(`Lepas ${person.nama} dari keluarga ini?`)) return;

    try {
      setIsPending(true);

      const formData = new FormData();
      formData.append('keluargaId', keluargaId);
      formData.append('wargaId', String(person.id));

      const result = await submitUnlinkWargaFromKeluarga(formData);

      if (!result.success) {
        alert(result.error ?? 'Gagal melepas warga dari keluarga.');
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <tr className="border-t border-slate-100 text-sm text-slate-700">
      <td className="px-5 py-3 font-medium text-slate-900">{person.nama}</td>

      <td className="px-5 py-3">{person.status_dalam_keluarga ?? '-'}</td>

      <td className="px-5 py-3">
        <GenderBadge gender={person.jenis_kelamin ?? null} />
      </td>

      <td className="px-5 py-3">{person.tahun_kelahiran ?? '-'}</td>

      <td className="px-5 py-3">
        <StatusWargaBadge status={person.status_warga ?? null} />
      </td>

      <td className="px-5 py-3">{person.asal_rt_domisili ?? '-'}</td>

      <td className="px-5 py-3">{person.alamat ?? '-'}</td>

      <td className="px-5 py-3">
        <button
          type="button"
          onClick={handleUnlink}
          disabled={isPending}
          className="text-sm font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
        >
          {isPending ? 'Memproses...' : 'Lepas'}
        </button>
      </td>
    </tr>
  );
}

function LinkWargaPanel({ keluarga }: { keluarga: KeluargaListRow }) {
  const [search, setSearch] = useState('');
  const [statusWarga, setStatusWarga] = useState('');
  const [statusDalamKeluarga, setStatusDalamKeluarga] = useState('Anak');
  const [selectedWargaId, setSelectedWargaId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // sementara kandidat diambil dari anggota yang belum ada? tidak.
  // karena page saat ini belum mengirim kandidat dari server per keluarga.
  // jadi kita tampilkan helper placeholder dulu agar alur linking siap dipasang
  // tanpa merusak tabel keluarga yang sudah berjalan.

  // Agar fitur tetap usable sekarang, kita minta user isi ID warga secara manual
  // jika belum ingin menambah load kandidat dari server page.
  // Nanti step berikutnya kita upgrade jadi search kandidat otomatis.
  async function handleSubmit() {
    if (!selectedWargaId) {
      alert('Pilih ID warga terlebih dahulu.');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('keluargaId', keluarga.id);
      formData.append('wargaId', String(selectedWargaId));
      formData.append('statusDalamKeluarga', statusDalamKeluarga);

      const result = await submitLinkWargaToKeluarga(formData);

      if (!result.success) {
        alert(result.error ?? 'Gagal menghubungkan warga ke keluarga.');
        return;
      }

      alert('Warga berhasil dihubungkan ke keluarga.');
      setSelectedWargaId(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Tambah Anggota ke Keluarga
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Keluarga: <span className="font-semibold text-slate-700">
              {keluarga.kepala_keluarga_nama ?? keluarga.nama_keluarga}
            </span>{' '}
            • {keluarga.rt} • {keluarga.alamat}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
        <p className="text-sm font-medium text-slate-700">
          Tahap linking dasar sudah aktif.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Untuk versi ini, Anda bisa menghubungkan warga dengan memasukkan ID warga
          yang ingin ditautkan ke keluarga ini. Setelah itu, saya sarankan kita
          lanjutkan tahap berikutnya: <strong>tabel kandidat warga belum terhubung</strong>
          agar proses linking bisa dipilih langsung dari daftar, bukan input ID manual.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            ID Warga
          </label>
          <input
            type="number"
            value={selectedWargaId ?? ''}
            onChange={(e) =>
              setSelectedWargaId(
                e.target.value ? Number(e.target.value) : null
              )
            }
            placeholder="Contoh: 158"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <p className="mt-2 text-xs text-slate-400">
            Isi dengan ID warga dari tabel <strong>warga-rw14</strong>.
          </p>
        </div>

        <div className="lg:col-span-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status dalam keluarga
          </label>
          <select
            value={statusDalamKeluarga}
            onChange={(e) => setStatusDalamKeluarga(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            {STATUS_DALAM_KELUARGA_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedWargaId}
            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses...' : 'Hubungkan ke keluarga'}
          </button>
        </div>
      </div>
    </div>
  );
}