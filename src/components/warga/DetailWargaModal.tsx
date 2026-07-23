'use client';

import { useEffect } from 'react';
import type { WargaRow } from '@/lib/warga-service';

interface Props {
  warga: WargaRow | null;
  onClose: () => void;
}

export function DetailWargaModal({ warga, onClose }: Props) {
  const isOpen = warga !== null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Detail Warga"
        className={`
          fixed right-0 top-0 bottom-0 z-50
          w-full max-w-[420px] bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header sticky */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 flex-shrink-0 bg-white">
          <div>
            <p className="text-sm font-semibold text-slate-900">Informasi Lanjutan</p>
            {warga && (
              <p className="text-xs text-slate-400 mt-0.5">{warga.asal_rt_domisili}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scroll content */}
        {warga && (
          <div className="flex-1 overflow-y-auto">

            {/* Identity strip */}
            <div className="px-6 py-5 bg-slate-50/70 border-b border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-slate-900 leading-snug">
                    {warga.nama}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {warga.status_dalam_keluarga} · {warga.asal_rt_domisili}
                  </p>
                </div>
                <GenderBadge value={warga.jenis_kelamin} />
              </div>
            </div>

            <div className="px-6 py-6 space-y-8">

              {/* ── Bantuan Sosial ── */}
              <Section title="Bantuan Sosial">
                <Field
                  label="Status Penerimaan Bantuan"
                  value={warga.status_penerimaan_bantuan}
                  highlight
                />
              </Section>

              {/* ── Tempat Tinggal ── */}
              <Section title="Tempat Tinggal">
                <Field label="Alamat Lengkap"      value={warga.alamat} />
                <Field label="Status Kepemilikan Rumah" value={warga.status_kepemilikan_rumah} />
              </Section>

              {/* ── Data Pribadi Tambahan ── */}
              <Section title="Data Pribadi Tambahan">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Agama"             value={warga.agama} />
                  <Field label="Status Perkawinan" value={warga.status_perkawinan} />
                </div>
              </Section>

            </div>
          </div>
        )}
      </aside>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3 pb-2 border-b border-slate-100">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label, value, highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  const isEmpty = !value || value === '-';
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-400 mb-0.5">{label}</p>
      <p className={`
        text-sm leading-snug
        ${highlight
          ? isEmpty
            ? 'text-slate-300 italic'
            : 'font-semibold text-slate-800'
          : isEmpty
            ? 'text-slate-300 italic'
            : 'text-slate-700'}
      `}>
        {isEmpty ? 'Tidak ada data' : value}
      </p>
    </div>
  );
}

function GenderBadge({ value }: { value: string }) {
  const isLaki = (value ?? '').toLowerCase().includes('laki');
  return (
    <span className={`
      flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full
      ${isLaki ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}
    `}>
      {value || '-'}
    </span>
  );
}