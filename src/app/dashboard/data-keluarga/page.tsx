import { getSession } from '@/lib/session';
import { mapUsernameToRT } from '@/lib/rt-utils';
import {
  getAvailableWarga,
  getDistinctKeluargaRTOptions,
  getDistinctKeluargaStatusOptions,
  getKeluargaList,
  getKeluargaSummary,
  type KeluargaQueryFilters,
} from '@/lib/keluarga-service';
import type { KeluargaURLParams } from '@/lib/keluarga-utils';

import KeluargaSummary from '@/components/keluarga/KeluargaSummary';
import KeluargaFilters from '@/components/keluarga/KeluargaFilters';
import KeluargaTable from '@/components/keluarga/KeluargaTable';
import KeluargaPagination from '@/components/keluarga/KeluargaPagination';

type SearchParams = Promise<{
  page?: string;
  rt?: string;
  anggota?: string;
  status?: string;
}>;

export default async function DataKeluargaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (!session) return null;

  const sp = await searchParams;

  const page = Math.max(1, parseInt(sp.page ?? '1', 10));
  const rtParam = sp.rt ?? '';
  const anggotaParam = sp.anggota ?? '';
  const statusParam = sp.status ?? '';

  const filters: KeluargaQueryFilters = {
    rt: rtParam,
    anggota: anggotaParam,
    status: statusParam,
  };

  const urlParams: KeluargaURLParams = {
    rt: rtParam,
    anggota: anggotaParam,
    status: statusParam,
  };

  const [
  summary,
  keluargaResult,
  rtOptions,
  statusOptions,
  availableWarga,
] = await Promise.all([
  getKeluargaSummary(session),
  getKeluargaList(session, filters, page),
  getDistinctKeluargaRTOptions(session),
  getDistinctKeluargaStatusOptions(session),
  getAvailableWarga(session),
]);

  const rtLabel =
    session.role === 'RT' ? mapUsernameToRT(session.username) : '';

  const pageDesc =
    session.role === 'RW'
      ? 'Kelola dan pantau data keluarga seluruh RT di RW 14.'
      : `Kelola dan pantau data keluarga untuk ${rtLabel || 'RT Anda'}.`;
  console.log(rtOptions);
  console.log(statusOptions);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Data Keluarga
        </h1>
        <p className="mt-1 text-sm text-slate-500">{pageDesc}</p>
      </div>

      {/* Summary */}
      <KeluargaSummary summary={summary} />

      {/* Table section */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <KeluargaFilters
            role={session.role}
            rtLabel={rtLabel}
            rtOptions={rtOptions}
            statusOptions={statusOptions}
            urlParams={urlParams}
          />
        </div>

        <KeluargaTable
          keluarga={keluargaResult.rows}
          availableWarga={availableWarga}
        />

        <div className="border-t border-slate-100 px-5 py-4">
          <KeluargaPagination
            total={keluargaResult.total}
            page={page}
            urlParams={urlParams}
          />
        </div>
      </div>
    </div>
  );
}