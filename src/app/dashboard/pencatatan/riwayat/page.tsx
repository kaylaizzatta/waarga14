import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/session';
import { getAuditLogs } from '@/lib/audit-service';

import RiwayatTable from '@/components/audit/RiwayatTable';

export default async function RiwayatPerubahanPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const logs = await getAuditLogs(session);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <Link
          href="/dashboard/pencatatan"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors mb-3"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Pencatatan Digital
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Riwayat Perubahan
        </h1>

        <p className="text-sm text-slate-400 mt-0.5">
          Aktivitas penambahan dan perubahan data warga yang dilakukan oleh pengurus.
        </p>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <p className="text-xs text-slate-500 uppercase tracking-wide">
          Total Aktivitas
        </p>

        <p className="text-3xl font-bold text-slate-900 mt-1">
          {logs.length}
        </p>
      </div>

      {/* Table */}
      <RiwayatTable logs={logs} />

    </div>
  );
}