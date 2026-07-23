'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { perbaruiWargaAction } from '@/actions/warga';
import type { WargaRow } from '@/lib/warga-service';

const V = '#6D5DFC';

/* ── Primitives (identik dengan TambahWargaForm) ─────────────────── */

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100">
        <p className="text-[13px] font-semibold text-slate-700">{title}</p>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  full = false,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-[12px] font-semibold text-slate-600 tracking-wide mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 ' +
  'placeholder:text-slate-400 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ' +
  'transition-colors';

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />;
}

function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${inputCls} appearance-none cursor-pointer pr-9`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}

function Opt({ items }: { items: string[] }) {
  return (
    <>
      <option value="">— Pilih —</option>
      {items.map((v) => (
        <option key={v} value={v}>{v}</option>
      ))}
    </>
  );
}

/* ── Options (identik dengan TambahWargaForm) ────────────────────── */

const OPT = {
  jenisKelamin: ['Laki-laki', 'Perempuan'],

  agama: ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'],

  statusPerkawinan: ['Belum Kawin', 'Kawin', 'Cerai Mati', 'Cerai Hidup'],

  rt: ['RT 01', 'RT 02', 'RT 03', 'RT 04'],

  statusKeluarga: [
    'Kepala Keluarga',
    'Istri',
    'Anak',
    'Menantu',
    'Cucu',
    'Orang Tua',
    'Mertua',
    'Famili Lain',
    'Lainnya',
  ],

  kepemilikanRumah: ['Milik Sendiri', 'Sewa', 'Kontrak'],

  pendidikan: [
    'Belum Sekolah',
    'Belum Tamat SD',
    'SD',
    'SMP',
    'SMA',
    'D3',
    'S1',
  ],

  pekerjaan: [
    'Belum / Tidak Bekerja',
    'Buruh Harian Lepas',
    'Guru',
    'Ibu Rumah Tangga',
    'Karyawan Swasta',
    'Mahasiswa',
    'Pegawai BUMN',
    'Pegawai Negeri Sipil (PNS)',
    'Pelajar',
    'Pensiunan',
    'Sopir',
    'Wiraswasta',
  ],

  bantuan: ['Ya', 'Tidak'],
};

/* ── Props ───────────────────────────────────────────────────────── */

interface Props {
  warga: WargaRow;
  success?: boolean;
}

/* ── Form ────────────────────────────────────────────────────────── */

export default function PerbaruiWargaForm({warga, success,}: Props) {
  const tahunSekarang = new Date().getFullYear();
  const [state, formAction, isPending] = useActionState(perbaruiWargaAction, null);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <Link
          href="/dashboard/data-warga"
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
          Perbarui Data Warga
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Perbarui informasi warga yang sudah terdaftar.
        </p>
      </div>

      <div className="h-px bg-slate-100" />
      {success && (
        <div
            className="
            flex items-start gap-3
            rounded-xl border border-emerald-200
            bg-emerald-50
            px-4 py-3
            "
        >
            <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            </svg>

            <p className="text-sm text-emerald-700">
            Data warga berhasil diperbarui.
            </p>
        </div>
        )}

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

      {/* Form */}
      <form className="space-y-5" action={formAction}>

        {/* Hidden: id untuk .update().eq('id', id) */}
        <input type="hidden" name="id" value={warga.id} />

        {/* 1. Identitas */}
        <SectionCard title="Identitas Warga">
          <Field label="Nama Lengkap" required full>
            <Input
              type="text"
              name="nama"
              defaultValue={warga.nama}
              placeholder="Contoh: Budi Santoso"
              autoComplete="off"
            />
          </Field>

          <Field label="Jenis Kelamin" required>
            <Select name="jenis_kelamin" defaultValue={warga.jenis_kelamin}>
              <Opt items={OPT.jenisKelamin} />
            </Select>
          </Field>

          <Field label="Tahun Kelahiran" required>
            <Input
              type="number"
              name="tahun_kelahiran"
              defaultValue={warga.tahun_kelahiran}
              min={1930}
              max={tahunSekarang}
            />
          </Field>

          <Field label="Agama" required>
            <Select name="agama" defaultValue={warga.agama}>
              <Opt items={OPT.agama} />
            </Select>
          </Field>

          <Field label="Status Perkawinan" required>
            <Select name="status_perkawinan" defaultValue={warga.status_perkawinan}>
              <Opt items={OPT.statusPerkawinan} />
            </Select>
          </Field>
        </SectionCard>

        {/* 2. Domisili & Keluarga */}
        <SectionCard title="Domisili & Keluarga">
          <Field label="RT Domisili" required>
            <Select name="asal_rt_domisili" defaultValue={warga.asal_rt_domisili}>
              <Opt items={OPT.rt} />
            </Select>
          </Field>

          <Field label="Status Dalam Keluarga" required>
            <Select name="status_dalam_keluarga" defaultValue={warga.status_dalam_keluarga}>
              <Opt items={OPT.statusKeluarga} />
            </Select>
          </Field>

          <Field label="Alamat" required full>
            <textarea
              name="alamat"
              rows={3}
              defaultValue={warga.alamat}
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Status Kepemilikan Rumah" required>
            <Select name="status_kepemilikan_rumah" defaultValue={warga.status_kepemilikan_rumah}>
              <Opt items={OPT.kepemilikanRumah} />
            </Select>
          </Field>
        </SectionCard>

        {/* 3. Pendidikan & Sosial */}
        <SectionCard title="Pendidikan & Sosial">
          <Field label="Pendidikan Terakhir" required>
            <Select name="tingkat_pendidikan_terakhir"
              defaultValue={warga.tingkat_pendidikan_terakhir}>
              <Opt items={OPT.pendidikan} />
            </Select>
          </Field>

          <Field label="Jenis Pekerjaan" required>
            <Select name="jenis_pekerjaan" defaultValue={warga.jenis_pekerjaan}>
              <Opt items={OPT.pekerjaan} />
            </Select>
          </Field>

          <Field label="Status Penerimaan Bantuan" required>
            <Select name="status_penerimaan_bantuan"
              defaultValue={warga.status_penerimaan_bantuan}>
              <Opt items={OPT.bantuan} />
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
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

      </form>
    </div>
  );
}