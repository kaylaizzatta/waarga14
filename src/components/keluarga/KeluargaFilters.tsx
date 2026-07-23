'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import type { Role } from '@/lib/types';
import {
  buildKeluargaURL,
  type KeluargaURLParams,
} from '@/lib/keluarga-utils';

interface KeluargaFiltersProps {
  role: Role;
  rtLabel: string;
  rtOptions: string[];
  statusOptions: string[];
  urlParams: KeluargaURLParams;
}

const ANGGOTA_OPTIONS = [
  { label: 'Semua anggota', value: '' },
  { label: '1 orang', value: '1' },
  { label: '2–4 orang', value: '2-4' },
  { label: '5+ orang', value: '5+' },
];

export default function KeluargaFilters({
  role,
  rtLabel,
  rtOptions,
  statusOptions,
  urlParams,
}: KeluargaFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [rt, setRt] = useState(urlParams.rt ?? '');
  const [anggota, setAnggota] = useState(urlParams.anggota ?? '');
  const [status, setStatus] = useState(urlParams.status ?? '');

  const hasActiveFilters = useMemo(() => {
    return Boolean(rt || anggota || status);
  }, [rt, anggota, status]);

  function applyFilters(next?: Partial<KeluargaURLParams>) {
    const finalParams: KeluargaURLParams = {
      rt: next?.rt ?? rt,
      anggota: next?.anggota ?? anggota,
      status: next?.status ?? status,
    };

    startTransition(() => {
      router.push(buildKeluargaURL(pathname, finalParams));
    });
  }

  function resetFilters() {
    setRt('');
    setAnggota('');
    setStatus('');

    startTransition(() => {
      router.push(buildKeluargaURL(pathname, {}));
    });
  }

  return (
    <div className="space-y-4">
      {/* Header kecil */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Filter Data Keluarga
          </h2>
          <p className="text-xs text-slate-500">
            Saring data keluarga berdasarkan RT, jumlah anggota, dan status keluarga.
          </p>
        </div>

        {role === 'RT' && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span className="font-medium text-slate-500">Akses RT:</span>
            <span className="font-semibold text-slate-800">{rtLabel || '-'}</span>
          </div>
        )}
      </div>

      {/* Grid filter */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* RT */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">Asal RT</label>

          {role === 'RW' ? (
            <select
              value={rt}
              onChange={(e) => {
                const value = e.target.value;
                setRt(value);
                applyFilters({ rt: value });
              }}
              disabled={isPending}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">Semua RT</option>
                {rtOptions.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
            </select>
          ) : (
            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">
              {rtLabel || '-'}
            </div>
          )}
        </div>

        {/* Jumlah anggota */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">Jumlah anggota</label>
          <select
            value={anggota}
            onChange={(e) => {
              const value = e.target.value;
              setAnggota(value);
              applyFilters({ anggota: value });
            }}
            disabled={isPending}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            {ANGGOTA_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status keluarga */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">Status keluarga</label>
          <select
            value={status}
            onChange={(e) => {
              const value = e.target.value;
              setStatus(value);
              applyFilters({ status: value });
            }}
            disabled={isPending}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="">Semua status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
          </select>
        </div>

        {/* Reset */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-transparent">Reset</label>
          <button
            type="button"
            onClick={resetFilters}
            disabled={isPending || !hasActiveFilters}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset filter
          </button>
        </div>
      </div>
    </div>
  );
}