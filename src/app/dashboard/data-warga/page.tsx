import { getSession } from '@/lib/session';
import {
  getWargaData,
  getWargaPageStats,
  getDistinctRTs,
  getDistinctStatusKeluarga,
  getDistinctPendidikan,
  getDistinctPekerjaan,
  getDistinctBPJS,              
  getDistinctStatusBantuan, 
  getPageByWargaId,    
  resolveRTFilter,
  mapUsernameToRT,
  getDistinctStatusWarga,
  type WargaQueryFilters,
} from '@/lib/warga-service';
import { type WargaURLParams } from '@/lib/warga-utils';
import { DataWargaSummary    } from '@/components/warga/DataWargaSummary';
import { DataWargaFilters    } from '@/components/warga/DataWargaFilters';
import { DataWargaTable      } from '@/components/warga/DataWargaTable';
import { DataWargaPagination } from '@/components/warga/DataWargaPagination';

type SearchParams = Promise<{
  page?:          string;
  search?:        string;
  alamat?:        string;
  rt?:            string;
  status?:        string;
  gender?:        string;
  pendidikan?:    string;
  pekerjaan?:     string;
  bpjs?:          string;   
  statusBantuan?: string;   
  id?: string; // tambah
  statusWarga?: string;
}>;

export default async function DataWargaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  let page              = Math.max(1, parseInt(sp.page ?? '1', 10));
  const search            = sp.search        ?? '';
  const alamat            = sp.alamat        ?? '';
  const rtParam           = sp.rt            ?? '';
  const statusParam       = sp.status        ?? '';
  const genderParam       = sp.gender        ?? '';
  const pendidikanParam   = sp.pendidikan    ?? '';
  const pekerjaanParam    = sp.pekerjaan     ?? '';
  const bpjsParam         = sp.bpjs          ?? '';   // ← BARU
  const statusBantuanParam = sp.statusBantuan ?? '';  // ← BARU
  const highlightId       = sp.id ?? '';
  const statusWargaParam = sp.statusWarga ?? '';

  if (highlightId && !sp.page) {
    page = await getPageByWargaId(Number(highlightId));
  }

  const session = await getSession();
  if (!session) return null;

  const rtFilter = resolveRTFilter(session, rtParam);

  const filters: WargaQueryFilters = {
    rtFilter,
    search,
    alamat,
    statusKeluarga: statusParam,
    gender:         genderParam,
    pendidikan:     pendidikanParam,
    pekerjaan:      pekerjaanParam,
    bpjs:           bpjsParam,           // ← BARU
    statusBantuan:  statusBantuanParam,  // ← BARU
    statusWarga: statusWargaParam,
  };

  const urlParams: WargaURLParams = {
    search,
    alamat,
    rt:            rtParam,
    status:        statusParam,
    gender:        genderParam,
    pendidikan:    pendidikanParam,
    pekerjaan:     pekerjaanParam,
    bpjs:          bpjsParam,            // ← BARU
    statusBantuan: statusBantuanParam,   // ← BARU
    statusWarga: statusWargaParam,
  };

  const [
    stats,
    wargaResult,
    rtOptions,
    statusOptions,
    pendidikanOptions,
    pekerjaanOptions,
    bpjsOptions,           // ← BARU
    statusBantuanOptions,  // ← BARU
    statusWargaOptions,
  ] = await Promise.all([
    getWargaPageStats(rtFilter),
    getWargaData(filters, page),
    session.role === 'RW' ? getDistinctRTs() : Promise.resolve([]),
    getDistinctStatusKeluarga(),
    getDistinctPendidikan(),
    getDistinctPekerjaan(),
    getDistinctBPJS(),           // ← BARU
    getDistinctStatusBantuan(),  // ← BARU
    getDistinctStatusWarga(),
  ]);

  const rtLabel  = session.role === 'RT' ? mapUsernameToRT(session.username) : '';
  const pageDesc = session.role === 'RW'
    ? (rtFilter ? `Data warga ${rtFilter}` : 'Seluruh data warga RW 14')
    : `Data warga ${rtLabel}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Data Warga</h1>
        <p className="text-sm text-slate-400 mt-1">{pageDesc}</p>
      </div>

      {stats && <DataWargaSummary stats={stats} />}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100">
          <DataWargaFilters
            role={session.role}
            urlParams={urlParams}
            rtOptions={rtOptions}
            statusOptions={statusOptions}
            pendidikanOptions={pendidikanOptions}
            pekerjaanOptions={pekerjaanOptions}
            bpjsOptions={bpjsOptions}                    // ← BARU
            statusBantuanOptions={statusBantuanOptions}  // ← BARU
            rtLabel={rtLabel}
            statusWargaOptions={statusWargaOptions}
          />
        </div>

        <DataWargaTable rows={wargaResult.rows} currentSearch={search} highlightId={highlightId} />

        <div className="px-5 py-4 border-t border-slate-100">
          <DataWargaPagination
            total={wargaResult.total}
            page={page}
            urlParams={urlParams}
          />
        </div>
      </div>
    </div>
  );
}