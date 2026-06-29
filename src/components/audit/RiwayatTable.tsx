'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAuditAction } from '@/app/dashboard/pencatatan/riwayat/actions';
import DetailAuditModal from './DetailAuditModal';

interface Props {
  logs: any[];
}

export default function RiwayatTable({
  logs,
}: Props) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const router = useRouter();
  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">
            Audit Trail
          </h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            Belum ada aktivitas yang tercatat.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full text-sm">

              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Waktu
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Pengguna
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Role
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Aksi
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Deskripsi
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Detail
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Hapus
                  </th>
                </tr>
              </thead>

              <tbody>

                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-800">
                      {log.akun?.nama ?? '-'}
                    </td>

                    <td className="px-4 py-3">
                      {log.akun?.role ?? '-'}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={
                          log.action === 'CREATE'
                            ? 'px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : log.action === 'UPDATE'
                            ? 'px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'px-2 py-1 rounded-full text-xs bg-red-50 text-red-700 border border-red-200'
                        }
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {log.description}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="
                          text-indigo-600
                          hover:text-indigo-800
                          font-medium
                        "
                      >
                        Detail
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={async () => {
                          const ok = window.confirm(
                            'Yakin ingin menghapus log audit ini?'
                          );

                          if (!ok) return;

                          try {
                            await deleteAuditAction(log.id);
                            router.refresh();
                          } catch (error) {
                            console.error(error);
                            alert('Gagal menghapus log');
                          }
                        }}
                        className="
                          text-red-600
                          hover:text-red-800
                          font-medium
                        "
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}
      </div>

      <DetailAuditModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </>
  );
}