import type { DashboardPageData, ChartDataPoint } from '@/lib/dashboard-service';
import { CtxBadge, QuickFact } from './hero-shared';

const V = '#6D5DFC';

interface Props {
  data: DashboardPageData;
  bantuanYa: ChartDataPoint | null;
}

export function HeroPanelRW({ data, bantuanYa }: Props) {
  const laki = data.genderStats.find(d =>
    d.name.toLowerCase().includes('laki')
  );

  const rataJiwaPerKK =
    data.kpi.totalKK > 0
      ? (data.kpi.totalWarga / data.kpi.totalKK).toFixed(1)
      : '–';

  // ✅ Aman: gunakan optional chaining + nullish coalescing
  const jumlahRT = data.rtRanking?.length ?? 0;

  const rataJiwaPerRT =
    jumlahRT > 0
      ? Math.round(data.kpi.totalWarga / jumlahRT)
      : null;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div
        className="h-[3px]"
        style={{ background: `linear-gradient(90deg,${V},#8B7EFF)` }}
      />

      <div className="p-6 flex flex-col lg:flex-row lg:items-stretch gap-0">

        {/* ── KIRI ── */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Total Penduduk Terdaftar
            </p>
            <div className="flex items-baseline gap-2.5">
              <span
                className="text-[4rem] font-black tabular-nums leading-none"
                style={{ color: V }}
              >
                {data.kpi.totalWarga.toLocaleString('id-ID')}
              </span>
              <span className="text-xl font-medium text-slate-400">jiwa</span>
            </div>
            <p className="text-sm text-slate-400 mt-1.5">{data.scope}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <CtxBadge tone="neutral">
              {data.kpi.totalKK} KK
            </CtxBadge>
            <CtxBadge
              tone={bantuanYa && bantuanYa.percentage > 30 ? 'warning' : 'success'}
            >
              {bantuanYa?.percentage ?? 0}% Penerima Bantuan
            </CtxBadge>
            {laki && (
              <CtxBadge tone="neutral">
                {laki.value.toLocaleString('id-ID')} L ·{' '}
                {data.kpi.totalPerempuan.toLocaleString('id-ID')} P
              </CtxBadge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
            {data.topPendidikan && (
              <QuickFact
                label="Pendidikan Utama"
                value={data.topPendidikan.name}
                pct={`${data.topPendidikan.percentage}%`}
              />
            )}
            {data.topPekerjaan && (
              <QuickFact
                label="Pekerjaan Utama"
                value={data.topPekerjaan.name}
                pct={`${data.topPekerjaan.percentage}%`}
              />
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-slate-100 mx-6 self-stretch flex-shrink-0" />
        <div className="lg:hidden h-px w-full bg-slate-100 my-5" />

        {/* ── KANAN: metrik tingkat RW ── */}
        <div className="flex flex-col justify-center gap-3 lg:w-[188px] flex-shrink-0">

          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Rata-rata Jiwa / KK
            </p>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-[1.75rem] font-black tabular-nums leading-none"
                style={{ color: V }}
              >
                {rataJiwaPerKK}
              </span>
              <span className="text-xs text-slate-400 font-medium">jiwa</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
              per kepala keluarga
            </p>
          </div>

          {jumlahRT > 0 && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Jumlah RT
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[1.75rem] font-black tabular-nums leading-none"
                  style={{ color: V }}
                >
                  {jumlahRT}
                </span>
                <span className="text-xs text-slate-400 font-medium">RT</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                dalam wilayah RW
              </p>
            </div>
          )}

          {rataJiwaPerRT !== null && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Rata-rata Jiwa / RT
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[1.75rem] font-black tabular-nums leading-none"
                  style={{ color: V }}
                >
                  {rataJiwaPerRT}
                </span>
                <span className="text-xs text-slate-400 font-medium">jiwa</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                per rukun tetangga
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}