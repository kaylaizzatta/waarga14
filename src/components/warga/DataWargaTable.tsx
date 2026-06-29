'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { DetailWargaModal } from './DetailWargaModal';
import type { WargaRow } from '@/lib/warga-service';
import { deleteWargaAction } from '@/app/dashboard/data-warga/actions';

interface Props {
  rows: WargaRow[];
  currentSearch: string;
  highlightId?: string;
}

export function DataWargaTable({ rows, currentSearch, highlightId, }: Props) {
  const [selected, setSelected] = useState<WargaRow | null>(null);
  const handleDelete = async (
  id: number,
  nama: string
    ) => {
      const confirmed = window.confirm(
        `Hapus data warga "${nama}" ?`
      );

      if (!confirmed) return;

      try {
        await deleteWargaAction(id,'Pindah');

        window.location.reload();
      } catch (err) {
        console.error(err);

        alert('Gagal menghapus data');
      }
    };
  const highlightedRowRef = useRef<HTMLTableRowElement | null>(null);

useEffect(() => {
  if (highlightedRowRef.current) {
    highlightedRowRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}, [highlightId]);

  return (
    <>
      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <EmptyState search={currentSearch} />
        ) : (
          <table className="w-full min-w-[1080px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {[
                  { label: 'Nama',             w: 'w-[190px]' },
                  { label: 'Status Keluarga',  w: 'w-[130px]' },
                  { label: 'RT',               w: 'w-[72px]'  },
                  { label: 'Alamat',           w: 'w-[160px]' },
                  { label: 'Jenis Kelamin',    w: 'w-[100px]' },
                  { label: 'Tahun Lahir',      w: 'w-[88px]'  },
                  { label: 'Pendidikan',       w: 'w-[140px]' },
                  { label: 'Pekerjaan',        w: 'w-[130px]' },
                  { label: '',                 w: 'w-[60px]'  },
                ].map(({ label, w }, i) => (
                  <th
                    key={i}
                    className={`
                      ${w} px-4 py-3 text-left text-[10px] font-bold
                      uppercase tracking-[0.12em] text-slate-400 whitespace-nowrap
                    `}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {rows.map((row) => {
                const isHighlighted = String(row.id) === highlightId;

                return (
                  <tr
                    key={row.id}
                    ref={isHighlighted ? highlightedRowRef : null}
                    className={`
                      group transition-colors duration-300
                      ${
                        isHighlighted
                          ? 'bg-amber-100 ring-2 ring-amber-400'
                          : 'hover:bg-indigo-50/30'
                      }
                    `}
                  >
                  {/* Nama */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-slate-800 leading-snug truncate max-w-[170px]" title={row.nama}>
                      {row.nama}
                    </p>
                  </td>

                  {/* Status Dalam Keluarga */}
                  <td className="px-4 py-3.5">
                    <StatusKeluargaBadge value={row.status_dalam_keluarga} />
                  </td>

                  {/* RT */}
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {row.asal_rt_domisili}
                    </span>
                  </td>

                  {/* Alamat */}
                  <td className="px-4 py-3.5 max-w-[160px]">
                    <p
                      className="text-xs text-slate-500 truncate"
                      title={row.alamat || '-'}
                    >
                      {row.alamat || '-'}
                    </p>
                  </td>

                  {/* Jenis Kelamin */}
                  <td className="px-4 py-3.5">
                    <GenderBadge value={row.jenis_kelamin} />
                  </td>

                  {/* Tahun Lahir */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-slate-500 tabular-nums">
                      {row.tahun_kelahiran}
                    </p>
                  </td>

                  {/* Pendidikan */}
                  <td className="px-4 py-3.5 max-w-[140px]">
                    <p
                      className="text-xs text-slate-500 truncate"
                      title={row.tingkat_pendidikan_terakhir || '-'}
                    >
                      {row.tingkat_pendidikan_terakhir || '-'}
                    </p>
                  </td>

                  {/* Pekerjaan */}
                  <td className="px-4 py-3.5 max-w-[130px]">
                    <p
                      className="text-xs text-slate-500 truncate"
                      title={row.jenis_pekerjaan || '-'}
                    >
                      {row.jenis_pekerjaan || '-'}
                    </p>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setSelected(row)}
                        className="
                          text-[11px] font-semibold text-indigo-500
                          hover:text-indigo-700 hover:underline
                          transition-colors whitespace-nowrap
                          opacity-60 group-hover:opacity-100
                        "
                      >
                        Detail
                      </button>

                      <Link
                        href={`/dashboard/pencatatan/perbarui/${row.id}`}
                        className="
                          text-[11px] font-semibold text-emerald-600
                          hover:text-emerald-700 hover:underline
                          transition-colors whitespace-nowrap
                          opacity-60 group-hover:opacity-100
                        "
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            row.id,
                            row.nama
                          )
                        }
                        className="
                          text-[11px] font-semibold text-red-600
                          hover:text-red-700 hover:underline
                          transition-colors whitespace-nowrap
                          opacity-60 group-hover:opacity-100
                        "
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        )}
      </div>

      <DetailWargaModal
        warga={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

/* ── Badge components ──────────────────────────────────────────── */

function StatusKeluargaBadge({ value }: { value: string }) {
  const style = getStatusKeluargaStyle(value);
  return (
    <span className={`
      inline-flex items-center text-[11px] font-semibold
      px-2 py-0.5 rounded-full whitespace-nowrap
      ${style}
    `}>
      {value || '-'}
    </span>
  );
}

function getStatusKeluargaStyle(status: string): string {
  const s = (status ?? '').toLowerCase();
  if (s.includes('kepala'))              return 'bg-indigo-50 text-indigo-700';
  if (s.includes('istri'))              return 'bg-purple-50 text-purple-700';
  if (s.includes('suami'))              return 'bg-sky-50 text-sky-700';
  if (s.includes('anak'))               return 'bg-amber-50 text-amber-700';
  if (s.includes('orang tua') || s.includes('ortu')) return 'bg-teal-50 text-teal-700';
  if (s.includes('menantu'))            return 'bg-pink-50 text-pink-700';
  if (s.includes('cucu'))               return 'bg-orange-50 text-orange-700';
  return 'bg-slate-100 text-slate-500';
}

function GenderBadge({ value }: { value: string }) {
  const isLaki = (value ?? '').toLowerCase().includes('laki');
  return (
    <span className={`
      text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap
      ${isLaki ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}
    `}>
      {value || '-'}
    </span>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg
          className="w-5 h-5 text-slate-300"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-500 mb-1">
        {search ? `Tidak ada warga dengan nama "${search}"` : 'Tidak ada data warga'}
      </p>
      <p className="text-xs text-slate-400">
        {search ? 'Coba kata kunci yang berbeda' : 'Data belum tersedia'}
      </p>
    </div>
  );
}