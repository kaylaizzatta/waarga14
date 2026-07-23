'use client';
import {
  RT_OPTIONS,
  JENIS_KELAMIN_OPTIONS,
  AGAMA_OPTIONS,
  STATUS_PERKAWINAN_OPTIONS,
  STATUS_DALAM_KELUARGA_OPTIONS,
  STATUS_KEPEMILIKAN_RUMAH_OPTIONS,
  PENDIDIKAN_OPTIONS,
  PEKERJAAN_OPTIONS,
  STATUS_BANTUAN_OPTIONS,
} from '@/lib/form-options';
import Link from 'next/link';
import { useActionState } from 'react';
import { tambahWargaAction } from '@/actions/warga';
import SectionCard from '@/components/warga/form/SectionCard';
import Field from '@/components/warga/form/Field';
import Input, { inputCls } from '@/components/warga/form/Input';
import Select from '@/components/warga/form/Select';
import Opt from '@/components/warga/form/Opt';
import { useState, useEffect } from "react";


const V = '#6D5DFC';
/* ── Form ────────────────────────────────────────────────────────── */
interface Props {
  role: 'RT' | 'RW';
  rtDikelola: string | null;
}

export default function TambahWargaForm({
  role,
  rtDikelola,
}: Props) {
  const tahunSekarang = new Date().getFullYear();
  const [state, formAction, isPending] = useActionState(
    tambahWargaAction,
    null
  
  );
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <Link
          href="/dashboard/pencatatan"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400
                     hover:text-slate-600 transition-colors mb-3"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Pencatatan Digital
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Tambah Warga Baru
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Isi seluruh data di bawah untuk mendaftarkan warga baru ke dalam sistem.
        </p>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Feedback */}
      {state && 'error' in state && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200
                        bg-red-50 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71
                 c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5
                 -3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {state && 'success' in state && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200
                        bg-emerald-50 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-sm text-emerald-700">Data warga berhasil disimpan.</p>
        </div>
      )}

      {/* Form */}
      <form className="space-y-5" action={formAction}>

        {/* 1. Identitas */}
        <SectionCard title="Identitas Warga">
          <Field label="Nama Lengkap" required full>
            <Input
              type="text"
              name="nama"
              placeholder="Contoh: Budi Santoso"
              autoComplete="off"
            />
          </Field>

          <Field label="Jenis Kelamin" required>
            <Select name="jenis_kelamin">
              <Opt items={JENIS_KELAMIN_OPTIONS} />
            </Select>
          </Field>

          <Field label="Tahun Kelahiran" required>
            <Input
              type="number"
              name="tahun_kelahiran"
              placeholder={`Contoh: ${tahunSekarang - 30}`}
              min={1930}
              max={tahunSekarang}
            />
          </Field>

          <Field label="Agama" required>
            <Select name="agama">
              <Opt items={AGAMA_OPTIONS} />
            </Select>
          </Field>

          <Field label="Status Perkawinan" required>
            <Select name="status_perkawinan">
              <Opt items={STATUS_PERKAWINAN_OPTIONS} />
            </Select>
          </Field>
        </SectionCard>

        {/* 2. Domisili & Keluarga */}
        <SectionCard title="Domisili & Keluarga">
          <Field label="RT Domisili" required>
            {role === 'RW' ? (
              <Select name="asal_rt_domisili">
                <Opt items={RT_OPTIONS} />
              </Select>
            ) : (
              <>
                <Input
                  value={rtDikelola ?? ''}
                  readOnly
                />

                <input
                  type="hidden"
                  name="asal_rt_domisili"
                  value={rtDikelola ?? ''}
                />
              </>
            )}
          </Field>

          {/*
            status_dalam_keluarga — field ini relevan untuk roadmap family_id.
            Nilai 'Kepala Keluarga' nantinya menjadi anchor saat Tambah Keluarga
            diimplementasikan.
          */}
          <Field label="Status Dalam Keluarga" required>
            <Select name="status_dalam_keluarga">
              <Opt items={STATUS_DALAM_KELUARGA_OPTIONS} />
            </Select>
          </Field>

          <Field label="Alamat" required full>
            <textarea
              name="alamat"
              rows={3}
              placeholder="Contoh: Jl. Melati No. 12, RT 01"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Status Kepemilikan Rumah" required>
            <Select name="status_kepemilikan_rumah">
              <Opt items={STATUS_KEPEMILIKAN_RUMAH_OPTIONS} />
            </Select>
          </Field>
        </SectionCard>

        {/* 3. Pendidikan & Sosial */}
        <SectionCard title="Pendidikan & Sosial">
          <Field label="Pendidikan Terakhir" required>
            <Select name="tingkat_pendidikan_terakhir">
              <Opt items={PENDIDIKAN_OPTIONS} />
            </Select>
          </Field>

          <Field label="Jenis Pekerjaan" required>
            <Select name="jenis_pekerjaan">
              <Opt items={PEKERJAAN_OPTIONS} />
            </Select>
          </Field>

          <Field label="Status Penerimaan Bantuan" required>
            <Select name="status_penerimaan_bantuan">
              <Opt items={STATUS_BANTUAN_OPTIONS} />
            </Select>
          </Field>
        </SectionCard>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/pencatatan"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600
                       border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                       hover:opacity-90 active:opacity-80 transition-opacity
                       disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: V }}
          >
            {isPending ? 'Menyimpan...' : 'Simpan Warga'}
          </button>
        </div>

      </form>
    </div>
  );
}