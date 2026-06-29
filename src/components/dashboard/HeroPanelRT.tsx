import type { DashboardPageData, ChartDataPoint } from '@/lib/dashboard-service';
import { CtxBadge, QuickFact } from './hero-shared';

const V = '#6D5DFC';

interface Props {
  data: DashboardPageData;
  bantuanYa: ChartDataPoint | null;
}

export function HeroPanelRT({ data, bantuanYa }: Props) {
  const laki = data.genderStats.find(d =>
    d.name.toLowerCase().includes('laki')
  );

  const rataJiwaPerKK =
    data.kpi.totalKK > 0
      ? (data.kpi.totalWarga / data.kpi.totalKK).toFixed(1)
      : '–';

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div
        className="h-[3px]"
        style={{ background: `linear-gradient(90deg,${V},#8B7EFF)` }}
      />

      <div className="p-6 flex flex-col">

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

        {/* 3-kolom: rata-rata jiwa/KK + pendidikan + pekerjaan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <QuickFact
            label="Rata-rata Jiwa / KK"
            value={rataJiwaPerKK}
            pct="jiwa"
            suffix="per KK"
          />
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
    </div>
  );
}