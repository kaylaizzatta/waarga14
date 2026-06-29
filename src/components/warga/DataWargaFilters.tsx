'use client';

import { useState, useRef, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Role } from '@/lib/types';
import {
  type WargaURLParams,
  buildWargaURL,
  countActiveFilters,
  EMPTY_WARGA_URL_PARAMS,
} from '@/lib/warga-utils';

interface Props {
  role:                  Role;
  urlParams:             WargaURLParams;
  rtOptions:             string[];
  statusOptions:         string[];
  pendidikanOptions:     string[];
  pekerjaanOptions:      string[];
  bpjsOptions:           string[];        // ← BARU
  statusBantuanOptions:  string[];        // ← BARU
  statusWargaOptions:    string[];
  rtLabel?:              string;
}

export function DataWargaFilters({
  role, urlParams,
  rtOptions, statusOptions, pendidikanOptions, pekerjaanOptions,
  bpjsOptions, statusBantuanOptions, statusWargaOptions,  // ← BARU
  rtLabel,
}: Props) {
  const router    = useRouter();
  const pathname  = usePathname();
  const [isPending, startTransition] = useTransition();

  const [inputNama,   setInputNama]   = useState(urlParams.search);
  const [inputAlamat, setInputAlamat] = useState(urlParams.alamat);
  const timerNama   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerAlamat = useRef<ReturnType<typeof setTimeout> | null>(null);

  function go(patch: Partial<WargaURLParams>) {
    const next = { ...urlParams, ...patch };
    startTransition(() => router.push(buildWargaURL(pathname, next)));
  }

  function handleNama(v: string) {
    setInputNama(v);
    if (timerNama.current) clearTimeout(timerNama.current);
    timerNama.current = setTimeout(() => go({ search: v }), 400);
  }

  function handleAlamat(v: string) {
    setInputAlamat(v);
    if (timerAlamat.current) clearTimeout(timerAlamat.current);
    timerAlamat.current = setTimeout(() => go({ alamat: v }), 400);
  }

  function clearNama() {
    setInputNama('');
    if (timerNama.current) clearTimeout(timerNama.current);
    go({ search: '' });
  }

  function clearAlamat() {
    setInputAlamat('');
    if (timerAlamat.current) clearTimeout(timerAlamat.current);
    go({ alamat: '' });
  }

  function handleReset() {
    setInputNama('');
    setInputAlamat('');
    if (timerNama.current)   clearTimeout(timerNama.current);
    if (timerAlamat.current) clearTimeout(timerAlamat.current);
    const reset: WargaURLParams = {
      ...EMPTY_WARGA_URL_PARAMS,
      rt: role === 'RT' ? urlParams.rt : '',
    };
    startTransition(() => router.push(buildWargaURL(pathname, reset)));
  }

  const activeCount = countActiveFilters(urlParams, role === 'RT');

  return (
    <div className="space-y-3">

      {/* ── Baris 1: Search nama + Search alamat + RT badge ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={inputNama}
          onChange={handleNama}
          onClear={clearNama}
          placeholder="Cari nama warga…"
          icon="search"
        />
        <SearchInput
          value={inputAlamat}
          onChange={handleAlamat}
          onClear={clearAlamat}
          placeholder="Cari alamat (mis: D14 No.10)…"
          icon="map"
        />
        {role === 'RT' && rtLabel && <RTBadge label={rtLabel} />}
      </div>

      {/* ── Baris 2: Dropdown filters ──
          RW: 7 dropdown → grid 4 kolom (baris 4+3)
          RT: 6 dropdown → grid 3 kolom (baris 3+3)
      ── */}
      <div className={`grid gap-3 ${
        role === 'RW'
          ? 'grid-cols-2 md:grid-cols-4'
          : 'grid-cols-2 md:grid-cols-3'
      }`}>

        {/* RT — hanya RW */}
        {role === 'RW' && (
          <FilterSelect
            placeholder="Semua RT"
            value={urlParams.rt}
            options={rtOptions}
            onChange={v => go({ rt: v })}
          />
        )}

        <FilterSelect
          placeholder="Semua Status"
          value={urlParams.status}
          options={statusOptions}
          onChange={v => go({ status: v })}
        />

        <FilterSelect
          placeholder="Semua Gender"
          value={urlParams.gender}
          options={['Laki-laki', 'Perempuan']}
          onChange={v => go({ gender: v })}
        />

        <FilterSelect
          placeholder="Semua Pendidikan"
          value={urlParams.pendidikan}
          options={pendidikanOptions}
          onChange={v => go({ pendidikan: v })}
        />

        <FilterSelect
          placeholder="Semua Pekerjaan"
          value={urlParams.pekerjaan}
          options={pekerjaanOptions}
          onChange={v => go({ pekerjaan: v })}
        />

        {/* ── BARU ── */}
        <FilterSelect
          placeholder="Semua BPJS"
          value={urlParams.bpjs}
          options={bpjsOptions}
          onChange={v => go({ bpjs: v })}
        />

        <FilterSelect
          placeholder="Semua Bantuan"
          value={urlParams.statusBantuan}
          options={statusBantuanOptions}
          onChange={v => go({ statusBantuan: v })}
        />

        <FilterSelect
          placeholder="Status Warga"
          value={urlParams.statusWarga}
          options={statusWargaOptions}
          onChange={v => go({ statusWarga: v })}
        />

      </div>

      {/* ── Baris 3: Active filter count + Reset ── */}
      <div className="flex items-center gap-3 min-h-[20px]">
        {activeCount > 0 && (
          <>
            <span className="text-xs text-slate-500">
              <span className="font-semibold text-indigo-600">{activeCount}</span>
              {' '}filter aktif
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors underline underline-offset-2"
            >
              Hapus semua
            </button>
          </>
        )}
        {isPending && (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin ml-auto" />
        )}
      </div>

    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function SearchInput({
  value, onChange, onClear, placeholder, icon,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  placeholder: string;
  icon: 'search' | 'map';
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
        {icon === 'search' ? <IconSearch /> : <IconMap />}
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200
          text-sm text-slate-900 placeholder:text-slate-300
          outline-none transition-all
          focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
        "
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Hapus"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <IconX />
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  placeholder, value, options = [], onChange,
}: {
  placeholder: string;
  value: string;
  options?: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`
          w-full appearance-none rounded-xl border border-slate-200 bg-white
          pl-3.5 pr-9 py-2.5 text-sm outline-none transition-all
          focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
          cursor-pointer
          ${value ? 'text-slate-800 font-medium' : 'text-slate-400'}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
        aria-hidden="true"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}

function RTBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100 flex-shrink-0">
      <IconPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
      <span className="text-xs font-semibold text-indigo-600 whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────────── */

function IconSearch() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}