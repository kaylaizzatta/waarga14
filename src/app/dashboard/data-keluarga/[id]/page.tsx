import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';
import {
  getAnggotaKeluarga,
  getKeluargaDetailById,
} from '@/lib/keluarga-detail-service';

type DetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const styleMap: Record<string, string> = {
    aktif: 'bg-emerald-50 text-emerald-700',
    pindah: 'bg-amber-50 text-amber-700',
    nonaktif: 'bg-slate-100 text-slate-700',
    kosong: 'bg-rose-50 text-rose-700',
  };

  const className = styleMap[normalized] ?? 'bg-slate-100 text-slate-700';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {status}
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
    value.includes('laki') ||
    value === 'l' ||
    value === 'male';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isLaki
          ? 'bg-sky-50 text-sky-700'
          : 'bg-pink-50 text-pink-700'
      }`}
    >
      {gender}
    </span>
  );
}

function StatusWargaBadge({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        -
      </span>
    );
  }

  const normalized = status.toLowerCase();

  const styleMap: Record<string, string> = {
    aktif: 'bg-emerald-50 text-emerald-700',
    pindah: 'bg-amber-50 text-amber-700',
    meninggal: 'bg-rose-50 text-rose-700',
    nonaktif: 'bg-slate-100 text-slate-700',
  };

  const className = styleMap[normalized] ?? 'bg-slate-100 text-slate-700';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {status}
    </span>
  );
}

export default async function DetailKeluargaPage({ params }: DetailPageProps) {
  const { id } = await params;

  const session = await getSession();
  if (!session) return null;

  const keluarga = await getKeluargaDetailById(id, session);
  if (!keluarga) {
    notFound();
  }

  const anggota = await getAnggotaKeluarga(id, session);

  return (
    <div className="space-y-6">
      {/* Header halaman */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/dashboard/data-keluarga"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Data Keluarga
            </Link>
            <span>/</span>
            <span>Detail Keluarga</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {keluarga.nama_keluarga}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Detail keluarga dan daftar anggota yang terhubung dalam satu kartu keluarga.
          </p>
        </div>

        <Link
          href="/dashboard/data-keluarga"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Kembali
        </Link>
      </div>

      {/* Ringkasan keluarga versi ringkas */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Informasi Keluarga
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <p className="text-xs font-medium text-slate-400">Kepala Keluarga</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                {keluarga.kepala_keluarga_nama ?? '-'}
                </p>
            </div>

            <div>
                <p className="text-xs font-medium text-slate-400">RT</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                {keluarga.rt}
                </p>
            </div>

            <div className="sm:col-span-2">
                <p className="text-xs font-medium text-slate-400">Alamat</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                {keluarga.alamat}
                </p>
            </div>

            {keluarga.catatan && (
                <div className="sm:col-span-2">
                <p className="text-xs font-medium text-slate-400">Catatan</p>
                <p className="mt-1 text-sm text-slate-700">{keluarga.catatan}</p>
                </div>
            )}
            </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Status Keluarga
            </p>

            <div className="mt-4">
            <StatusBadge status={keluarga.status_keluarga} />
            </div>

            <div className="mt-5">
            <p className="text-xs font-medium text-slate-400">Jumlah Anggota</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
                {keluarga.jumlah_anggota}
            </p>
            <p className="text-sm text-slate-500">anggota terhubung</p>
            </div>
        </div>
        </div>

      {/* Tabel anggota keluarga */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-900">Anggota Keluarga</h2>
          <p className="mt-1 text-sm text-slate-500">
            Menampilkan seluruh warga yang saat ini terhubung ke keluarga ini.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Status Keluarga</th>
                <th className="px-6 py-4">Jenis Kelamin</th>
                <th className="px-6 py-4">Tahun Lahir</th>
                <th className="px-6 py-4">Status Warga</th>
                <th className="px-6 py-4">RT Domisili</th>
                <th className="px-6 py-4">Alamat</th>
              </tr>
            </thead>

            <tbody>
              {anggota.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                    Belum ada anggota keluarga yang terhubung.
                  </td>
                </tr>
              ) : (
                anggota.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 text-sm text-slate-700"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4">
                      {item.status_dalam_keluarga ?? '-'}
                    </td>
                    <td className="px-6 py-4">
                      <GenderBadge gender={item.jenis_kelamin} />
                    </td>
                    <td className="px-6 py-4">
                      {item.tahun_kelahiran ?? '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusWargaBadge status={item.status_warga} />
                    </td>
                    <td className="px-6 py-4">
                      {item.asal_rt_domisili ?? '-'}
                    </td>
                    <td className="px-6 py-4">
                      {item.alamat ?? '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}