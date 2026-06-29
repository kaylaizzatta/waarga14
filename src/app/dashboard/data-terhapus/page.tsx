import RestoreButton from '@/components/warga/RestoreButton';
import { getSession } from '@/lib/session';
import {
  resolveRTFilter,
  getDeletedWarga,
} from '@/lib/warga-service';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    statusWarga?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const params = await searchParams;

  const statusWarga =
    params.statusWarga ?? '';

  const startDate =
    params.startDate ?? '';

  const endDate =
    params.endDate ?? '';

  const session =
    await getSession();

  if (!session) {
    return null;
  }

  const rtFilter =
    resolveRTFilter(
      session,
      ''
    );

  const rows =
  await getDeletedWarga(
    rtFilter,
    statusWarga,
    startDate,
    endDate
  );

  const totalData = rows.length;
  const totalPindah =
    rows.filter(
      (r) => r.status_warga === 'Pindah'
    ).length;

  const totalMeninggal =
    rows.filter(
      (r) => r.status_warga === 'Meninggal'
    ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Data Terhapus
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Data warga yang telah dihapus dan masih dapat dipulihkan.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-5">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500">
            Total Data Terhapus
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            {totalData}
          </p>
        </div>

        <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-orange-600">
            Status Pindah
          </p>

          <p className="text-2xl font-bold text-orange-700 mt-2">
            {totalPindah}
          </p>
        </div>

        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-rose-600">
            Status Meninggal
          </p>

          <p className="text-2xl font-bold text-rose-700 mt-2">
            {totalMeninggal}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-5 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          Filter Data Terhapus
        </h3>

        <form className="grid gap-4 md:grid-cols-4">

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Status Warga
            </label>

            <select
              name="statusWarga"
              defaultValue={statusWarga}
              className="
                w-full
                px-3 py-2.5
                rounded-xl
                border border-slate-200
                text-sm
                text-slate-700
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-slate-200
              "
            >
              <option value="">
                Semua Status
              </option>

              <option value="Pindah">
                Pindah
              </option>

              <option value="Meninggal">
                Meninggal
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Dari Tanggal
            </label>

            <input
              type="date"
              name="startDate"
              defaultValue={startDate}
              className="
                w-full
                px-3 py-2.5
                rounded-xl
                border border-slate-200
                text-sm
                text-slate-700
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-slate-200
              "
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Sampai Tanggal
            </label>

            <input
              type="date"
              name="endDate"
              defaultValue={endDate}
              className="
                w-full
                px-3 py-2.5
                rounded-xl
                border border-slate-200
                text-sm
                text-slate-700
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-slate-200
              "
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="
                flex-1
                px-4 py-2.5
                rounded-xl
                bg-slate-900
                text-white
                text-sm
                font-medium
                hover:bg-slate-800
                transition-colors
              "
            >
              Terapkan
            </button>

            <a
              href="/dashboard/data-terhapus"
              className="
                px-4 py-2.5
                rounded-xl
                border border-slate-200
                text-sm
                text-slate-600
                hover:bg-slate-50
                transition-colors
              "
            >
              Reset
            </a>
          </div>

        </form>
        <p className="text-xs text-slate-400 mt-2">
          Kosongkan tanggal jika ingin melihat seluruh riwayat penghapusan.
        </p>
      </div>

      {/* Empty State */}
      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="py-16 text-center">
            <p className="text-slate-500 font-medium">
              Tidak ada data terhapus
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Semua data warga masih aktif.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Nama
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tanggal Dihapus
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  RT
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status Warga
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-800">
                      {row.nama}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-slate-600">
                      {row.deleted_at
                        ? new Date(
                            row.deleted_at
                          ).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-slate-600">
                      {row.asal_rt_domisili}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {row.status_warga ===
                    'Meninggal' ? (
                      <span
                        className="
                          inline-flex items-center
                          px-2.5 py-1
                          rounded-full
                          text-xs font-semibold
                          bg-rose-100
                          text-rose-700
                        "
                      >
                        Meninggal
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex items-center
                          px-2.5 py-1
                          rounded-full
                          text-xs font-semibold
                          bg-orange-100
                          text-orange-700
                        "
                      >
                        {row.status_warga}
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <RestoreButton
                      id={row.id}
                      nama={row.nama}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}