'use client';

import { useMemo, useState } from 'react';
import KeluargaItem from './KeluargaItem';
import ActionButtons from './ActionButtons';
import { useRouter } from 'next/navigation';
import { deleteKeluarga } from '@/app/dashboard/data-keluarga/actions';
import {
  submitLinkWargaToKeluarga,
  submitUnlinkWargaFromKeluarga,
} from '@/actions/keluarga-actions';
import type {
  AvailableWargaRow,
  KeluargaListRow,
  KeluargaAnggotaRow,
} from '@/lib/keluarga-service';
import { updateKeluarga } from '@/actions/keluarga-actions';
import EditKeluargaPanel from './EditKeluargaPanel';
import StatusBadge from './StatusBadge';
import AnggotaTable from './AnggotaTable';
import MobileKeluargaCard from './MobileKeluargaCard';


interface KeluargaTableProps {
  keluarga: KeluargaListRow[];
  availableWarga: AvailableWargaRow[];
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

export default function KeluargaTable({ keluarga, availableWarga, }: KeluargaTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const rows = useMemo(() => keluarga ?? [], [keluarga]);
  const filteredRows = rows.filter((item) => {
  const keyword = search.toLowerCase().trim();

  if (!keyword) return true;

  return (
    (item.kepala_keluarga_nama ?? '')
      .toLowerCase()
      .includes(keyword) ||

    (item.nama_keluarga ?? '')
      .toLowerCase()
      .includes(keyword) ||

    (item.alamat ?? '')
      .toLowerCase()
      .includes(keyword) ||

    (item.rt ?? '')
      .toLowerCase()
      .includes(keyword)
  );
});

  function toggleEdit(id: string) {
    setEditingId((prev) => (prev === id ? null : id));
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function toggleLinking(id: string) {
    setLinkingId((prev) => (prev === id ? null : id));
  }

  return (
  <>
    {/* Desktop */}
    <div className="hidden lg:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Daftar Keluarga
        </h2>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Menampilkan keluarga beserta anggota warga yang terhubung di sistem.
        </p>

        <div className="mt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kepala keluarga, alamat, atau RT..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
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
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  Belum ada data keluarga yang bisa ditampilkan.
                </td>
              </tr>
            ) : (
              filteredRows.map((item) => {
                const anggota = item.anggota ?? [];
                const isExpanded = expandedId === item.id;
                const isLinking = linkingId === item.id;

                return (
                  <FragmentRow
                    key={item.id}
                    item={item}
                    anggota={anggota}
                    availableWarga={availableWarga}
                    isExpanded={isExpanded}
                    isLinking={isLinking}
                    onToggleExpand={() => toggleExpand(item.id)}
                    onToggleLinking={() => toggleLinking(item.id)}
                    isEditing={editingId === item.id}
                    onToggleEdit={() => toggleEdit(item.id)}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Mobile */}
    <div className="space-y-4 lg:hidden">
      {filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Belum ada data keluarga yang bisa ditampilkan.
        </div>
      ) : (
        filteredRows.map((item) => {
  const anggota = item.anggota ?? [];
  const isExpanded = expandedId === item.id;
  const isLinking = linkingId === item.id;
  const isEditing = editingId === item.id;

  return (
    <div key={item.id} className="space-y-3">

      <MobileKeluargaCard
        item={item}
        isExpanded={isExpanded}
        isLinking={isLinking}
        isEditing={isEditing}
        isDeleting={false}
        canDelete={item.jumlah_anggota === 0}
        onToggleExpand={() => toggleExpand(item.id)}
        onToggleLinking={() => toggleLinking(item.id)}
        onToggleEdit={() => toggleEdit(item.id)}
        onDelete={() => {}}
      />

          {isExpanded && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 font-semibold text-slate-900">
                Daftar Anggota
              </h3>

              <AnggotaTable
                anggota={anggota}
                keluargaId={item.id}
              />
            </div>
          )}

          {isLinking && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <LinkWargaPanel
                keluarga={item}
                availableWarga={availableWarga}
                onClose={() => toggleLinking(item.id)}
              />
            </div>
          )}

          {isEditing && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <EditKeluargaPanel
                keluarga={item}
                onClose={() => toggleEdit(item.id)}
              />
            </div>
          )}

        </div>
      );
    })
      )}
    </div>
  </>
);
}

type FragmentRowProps = {
  item: KeluargaListRow;
  anggota: KeluargaAnggotaRow[];
  availableWarga: AvailableWargaRow[];
  isExpanded: boolean;
  isLinking: boolean;
  isEditing: boolean;
  onToggleExpand: () => void;
  onToggleLinking: () => void;
  onToggleEdit: () => void;
};

function FragmentRow({
  item,
  anggota,
  availableWarga,
  isExpanded,
  isLinking,
  isEditing,
  onToggleExpand,
  onToggleLinking,
  onToggleEdit,
}: FragmentRowProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (
      !confirm(
        `Yakin ingin menghapus keluarga ${
          item.kepala_keluarga_nama ?? item.nama_keluarga
        }?`
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);

      const result = await deleteKeluarga(item.id);

      if (!result.success) {
        alert(result.error ?? 'Gagal menghapus keluarga.');
        return;
      }

      alert('Keluarga berhasil dihapus.');

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

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
          <ActionButtons
            isExpanded={isExpanded}
            isLinking={isLinking}
            isEditing={isEditing}
            canDelete={item.jumlah_anggota === 0}
            isDeleting={isDeleting}
            onToggleExpand={onToggleExpand}
            onToggleLinking={onToggleLinking}
            onToggleEdit={onToggleEdit}
            onDelete={handleDelete}
          />
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-t border-slate-100 bg-slate-50/60">
          <td colSpan={6} className="px-6 py-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Anggota Keluarga
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Menampilkan warga yang terhubung ke keluarga ini.
                </p>
              </div>
              <AnggotaTable
                anggota={anggota}
                keluargaId={item.id}
              />
            </div>
          </td>
        </tr>
      )}
      
        {isLinking && (
          <tr className="border-t border-slate-100 bg-emerald-50/40">
            <td colSpan={6} className="px-6 py-5">
              <LinkWargaPanel
                keluarga={item}
                availableWarga={availableWarga}
                onClose={onToggleLinking}
              />
            </td>
          </tr>
        )}
        {isEditing && (
          <tr className="border-t border-slate-100 bg-blue-50/40">
            <td colSpan={6} className="px-6 py-5">
              <EditKeluargaPanel
                keluarga={item}
                onClose={onToggleEdit}
              />
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
        {person.jenis_kelamin ?? '-'}
      </td>

      <td className="px-5 py-3">{person.tahun_kelahiran ?? '-'}</td>

      <td className="px-5 py-3">
        {person.status_warga ?? '-'}
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

function LinkWargaPanel({
  keluarga,
  availableWarga,
  onClose,
}: {
  keluarga: KeluargaListRow;
  availableWarga: AvailableWargaRow[];
  onClose: () => void;
}) {
  const [statusDalamKeluarga, setStatusDalamKeluarga] =
    useState('Anak');

  const [selectedWargaId, setSelectedWargaId] =
    useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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
      formData.append(
        'statusDalamKeluarga',
        statusDalamKeluarga
      );

      const result =
        await submitLinkWargaToKeluarga(formData);

      if (!result.success) {
        alert(
          result.error ??
            'Gagal menghubungkan warga ke keluarga.'
        );
        return;
      }

      alert('Warga berhasil dihubungkan ke keluarga.');

      setSelectedWargaId(null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5">
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Tambah Anggota ke Keluarga
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Keluarga:{' '}
            <span className="font-semibold text-slate-700">
              {keluarga.kepala_keluarga_nama ??
                keluarga.nama_keluarga}
            </span>{' '}
            • {keluarga.rt} • {keluarga.alamat}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            PILIH WARGA
          </label>

          <select
            value={selectedWargaId ?? ''}
            onChange={(e) =>
              setSelectedWargaId(
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Pilih warga...</option>

            {availableWarga.map((warga) => (
              <option key={warga.id} value={warga.id}>
                {warga.nama} • {warga.rt}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-slate-400">
            Hanya menampilkan warga yang belum terhubung ke keluarga.
          </p>
        </div>

        <div className="lg:col-span-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status dalam keluarga
          </label>

          <select
            value={statusDalamKeluarga}
            onChange={(e) =>
              setStatusDalamKeluarga(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            {STATUS_DALAM_KELUARGA_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 lg:items-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedWargaId}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? 'Memproses...'
              : 'Hubungkan ke keluarga'}
          </button>
        </div>
      </div>
    </div>
  );
}