import { HeroPanelRW } from '@/components/dashboard/HeroPanelRW';
import { HeroPanelRT } from '@/components/dashboard/HeroPanelRT';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getDashboardPageData, getLastUpdatedInfo } from '@/lib/dashboard-service';
import type {
  DashboardPageData,
  ChartDataPoint,
  RTRankingRow,
  TopInsight,
  LastUpdatedInfo,
} from '@/lib/dashboard-service';

const V            = '#6D5DFC';
const BPJS_COLORS  = ['#6D5DFC', '#10B981', '#F59E0B', '#06B6D4'];
const STAT_COLORS  = ['#6D5DFC', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];
const RANK_COLORS  = ['#6D5DFC', '#8B7EFF', '#94A3B8', '#94A3B8'];

// ── Auto insight type ─────────────────────────────────────────────

interface AutoInsight {
  id:    string;
  path:  string;
  label: string;
  value: string;
  sub:   string;
  sub2?: string;
  tone:  'violet' | 'success' | 'warning' | 'neutral';
}

function buildInsights(data: DashboardPageData, isRW: boolean): AutoInsight[] {
  const list: AutoInsight[] = [];
  const PIN    = 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z';
  const HEART  = 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z';
  const SHIELD = 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z';
  const USERS  = 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0Zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0Z';

  // ── Insight khusus RW ──────────────────────────────────────────
  if (isRW && (data.rtRanking?.length ?? 0) > 0) {
    const ranking = data.rtRanking!;
    const rt      = ranking[0];
    const pctDariTotal = data.kpi.totalWarga > 0
      ? ((rt.totalWarga / data.kpi.totalWarga) * 100).toFixed(1)
      : '0';

    list.push({
      id: 'rt-large', path: PIN, tone: 'violet',
      label: 'RT Terbanyak Warga',
      value: `${rt.rt} · ${rt.totalWarga} jiwa`,
      sub:   `${rt.totalKK} kepala keluarga`,
      sub2:  `${pctDariTotal}% dari total penduduk RW`,
    });

    const top = [...ranking]
      .filter(r => r.totalWarga > 0)
      .sort((a, b) => (b.totalBantuan / b.totalWarga) - (a.totalBantuan / a.totalWarga))[0];
    if (top) {
      const pct = ((top.totalBantuan / top.totalWarga) * 100).toFixed(1);
      list.push({
        id: 'rt-bantuan', path: HEART, tone: 'violet',
        label: 'Rasio Bantuan Tertinggi',
        value: `${top.rt} · ${pct}%`,
        sub:   `${top.totalBantuan} penerima bantuan`,
        sub2:  `${top.totalWarga} total warga`,
      });
    }
  }

  // ── BPJS: semua akun ──────────────────────────────────────────
  if (data.bpjsStats.length > 0) {
    const t = data.bpjsStats[0];
    list.push({
      id: 'bpjs', path: SHIELD, tone: 'violet',
      label: 'BPJS Terbanyak',
      value: `${t.name} · ${t.percentage}%`,
      sub:   `${t.value.toLocaleString('id-ID')} peserta`,
      sub2:  'Mayoritas kepesertaan warga',
    });
  }

  // ── Insight khusus RT ─────────────────────────────────────────
  if (!isRW) {

    // Insight 2: Komposisi Gender
    const topGender = data.genderStats[0] ?? null;
    if (topGender) {
      list.push({
        id: 'gender-rt', path: USERS, tone: 'violet',
        label: 'Komposisi Gender',
        value: `${topGender.name} · ${topGender.percentage}%`,
        sub:   `${topGender.value.toLocaleString('id-ID')} warga`,
        sub2:  'Mayoritas penduduk RT',
      });
    }

    // Bantuan Sosial
    // Insight 3: Status Keluarga Dominan
    const bantuanData = data.bantuanStats.find(d => d.name === 'Ya');
    if (bantuanData && bantuanData.value > 0 && data.kpi.totalWarga > 0) {
      const rasio = Math.round(data.kpi.totalWarga / bantuanData.value);
      list.push({
        id: 'bantuan-rasio-rt', path: HEART,
        tone: bantuanData.percentage > 30 ? 'warning' : 'success',
        label: 'Rasio Bantuan Sosial',
        value: `1 dari ${rasio} warga`,
        sub:   `${bantuanData.value} penerima bantuan`,
        sub2:  `${bantuanData.percentage}% dari total warga`,
      });
    }
  }

  return list;
}

// ── Page ──────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  const data = await getDashboardPageData(session);
  if (!data) return <ErrorState />;

  const isRW      = session.role === 'RW';
  const insights  = buildInsights(data, isRW);
  const bantuanYa = data.bantuanStats.find(d => d.name === 'Ya');

  const lastUpdated = await getLastUpdatedInfo(session);

  return (
    <div className="space-y-5">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Ringkasan kondisi warga {data.scope}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 min-w-0">

  {/* Badge: shrink jika ruang sempit, button tetap fix */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shrink min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-400 whitespace-nowrap">
                Diperbarui{' '}
                <span className="font-semibold text-slate-700">
                  {lastUpdated.tanggal}
                </span>
              </p>
              {lastUpdated.olehRT && (
                <p className="text-[10px] text-slate-400 leading-tight whitespace-nowrap">
                  oleh{' '}
                  <span className="font-semibold text-slate-600">
                    {lastUpdated.olehRT}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Button: flex-shrink-0 agar tidak terpotong */}
          <Link
            href="/dashboard/data-warga"
            className="flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90 whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: V }}
          >
            Lihat Data
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── HERO ROW: stats (left) + RT ranking (right) ─────── */}
      {/* Single source of truth: no KPI section below this */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5">
            {isRW ? (
              <HeroPanelRW data={data} bantuanYa={bantuanYa ?? null} />
            ) : (
              <HeroPanelRT data={data} bantuanYa={bantuanYa ?? null} />
            )}

            {isRW && data.rtRanking && data.rtRanking.length > 0 && (
              <RTPanel data={data.rtRanking} />
            )}

            {!isRW && (
              <RTStatusPanel data={data}/>
            )}
        </div>
      </section>

      {/* ── AUTO INSIGHTS (before charts — most actionable) ──── */}
      {insights.length > 0 && (
        <section>
          <SectionHeading>Insight Otomatis</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.map(i => <InsightChip key={i.id} insight={i} />)}
          </div>
        </section>
      )}

      {/* ── DEMOGRAPHICS: compact 2×2, equal heights ─────────── */}
      <section>
        <SectionHeading>Kondisi Demografis</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GenderPanel   data={data.genderStats} />
          <BantuanPanel  data={data.bantuanStats} total={data.kpi.totalWarga} />
          <BPJSPanel     data={data.bpjsStats} />
          <StatusPanel   data={data.statusKeluargaStats} />
        </div>
      </section>

    </div>
  );
}

// ── RT RANKING PANEL ──────────────────────────────────────────────

function RTPanel({ data }: { data: RTRankingRow[] }) {
  const maxW = Math.max(...data.map(r => r.totalWarga), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100">
        <p className="text-[13px] font-semibold text-slate-700">Perbandingan RT</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Diurutkan: warga terbanyak
        </p>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-[28px_1fr_44px_30px_56px] gap-x-2 px-4 py-2 bg-slate-50/60 border-b border-slate-100">
        {['', 'RT', 'Warga', 'KK', 'Bantuan'].map((h, i) => (
          <span
            key={h}
            className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400"
            style={{ textAlign: i > 1 ? 'right' : 'left' }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 divide-y divide-slate-50">
        {data.map((row, i) => {
          const bantuanPct = row.totalWarga > 0
            ? ((row.totalBantuan / row.totalWarga) * 100).toFixed(1)
            : '0';

          return (
            <div
              key={row.rt}
              className="grid grid-cols-[28px_1fr_44px_30px_56px] gap-x-2 items-center px-4 py-3.5 hover:bg-slate-50/50 transition-colors"
            >
              {/* Rank */}
              <span
                className="w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: RANK_COLORS[i] ?? '#94A3B8' }}
              >
                {i + 1}
              </span>

              {/* RT + bar */}
              <div>
                <p className="text-[12px] font-semibold text-slate-800 leading-snug">{row.rt}</p>
                <div className="mt-1.5 h-0.5 bg-slate-100 rounded-full overflow-hidden w-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(row.totalWarga / maxW) * 100}%`,
                      backgroundColor: RANK_COLORS[i] ?? '#94A3B8',
                    }}
                  />
                </div>
              </div>

              {/* Warga */}
              <p className="text-[12px] font-black text-slate-900 tabular-nums text-right">
                {row.totalWarga}
              </p>

              {/* KK */}
              <p className="text-[11px] text-slate-500 tabular-nums text-right">
                {row.totalKK}
              </p>

              {/* Bantuan */}
              <div className="text-right">
                <p className="text-[11px] text-slate-500 tabular-nums">{row.totalBantuan}</p>
                <p className="text-[10px] font-bold text-emerald-600">{bantuanPct}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── RT STATUS PANEL ───────────────────────────────────────────────

// GANTI SELURUH FUNGSI:
function RTStatusPanel({ data }: { data: DashboardPageData }) {
  const topStatusKel = data.statusKeluargaStats[0] ?? null;
  const topBpjs      = data.bpjsStats[0] ?? null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden">

      <div className="px-5 py-3.5 border-b border-slate-100">
        <p className="text-[13px] font-semibold text-slate-700">Status RT</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Ringkasan wilayah {data.scope}
        </p>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">

        {/* Card 1: Status Keluarga Dominan */}
        <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Status Keluarga Dominan
          </p>
          {topStatusKel ? (
            <>
              <p className="text-xl font-black text-slate-800 leading-tight break-words">
                {topStatusKel.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">
                {topStatusKel.value.toLocaleString('id-ID')} warga
                {' · '}
                {topStatusKel.percentage}% dari total warga
              </p>
            </>
          ) : (
            <p className="text-[11px] text-slate-400">Data tidak tersedia</p>
          )}
        </div>

        {/* Card 2: BPJS Dominan */}
        <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            BPJS Dominan
          </p>
          {topBpjs ? (
            <>
              <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                {topBpjs.name}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[1.75rem] font-black tabular-nums leading-none"
                  style={{ color: V }}
                >
                  {topBpjs.percentage}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                {topBpjs.value.toLocaleString('id-ID')} peserta
              </p>
            </>
          ) : (
            <p className="text-[11px] text-slate-400">Data tidak tersedia</p>
          )}
        </div>

      </div>
    </div>
  );
}

// ── DEMOGRAPHIC PANELS ────────────────────────────────────────────

function GenderPanel({ data }: { data: ChartDataPoint[] }) {
  const laki = data.find((d) => d.name.toLowerCase().includes('laki'));
  const perempuan = data.find((d) => !d.name.toLowerCase().includes('laki'));

  if (!laki || !perempuan) return null;

  const total = laki.value + perempuan.value;

  return (
    <DemoCard
      title="Jenis Kelamin"
      subtitle="Distribusi gender warga"
    >
      <div className="flex flex-col xl:flex-row xl:items-center gap-5 xl:gap-4 pt-[7px] overflow-hidden">

        <div
          className="flex-shrink-0 mx-auto xl:mx-0 flex items-center justify-center"
          style={{ width: 210, height: 210 }}
        >
          <div style={{ transform: 'scale(1.1)', transformOrigin: 'center' }}>
            <DonutChart
              size={190}
              centerValue={total.toLocaleString('id-ID')}
              centerLabel="Warga"
              segments={[
                { value: laki.value, color: '#6D5DFC' },
                { value: perempuan.value, color: '#F43F5E' },
              ]}
            />
          </div>
        </div>

        <div className="hidden xl:block w-px self-stretch bg-slate-100 flex-shrink-0" />
        <div className="xl:hidden h-px w-full bg-slate-100 flex-shrink-0" />

        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-5 pb-1">
          <DonutLegend
            label="Laki-laki"
            value={laki.value}
            percentage={laki.percentage}
            color="#6D5DFC"
          />
          <DonutLegend
            label="Perempuan"
            value={perempuan.value}
            percentage={perempuan.percentage}
            color="#F43F5E"
          />
        </div>

      </div>
    </DemoCard>
  );
}

function BantuanPanel({
  data,
  total,
}: {
  data: ChartDataPoint[];
  total: number;
}) {
  const ya = data.find((d) => d.name === 'Ya');
  const tidak = data.find((d) => d.name === 'Tidak');

  if (!ya || !tidak) return null;

  return (
    <DemoCard
      title="Bantuan Sosial"
      subtitle="Status penerimaan bantuan"
    >
      <div className="flex flex-col xl:flex-row xl:items-center gap-5 xl:gap-4 pt-[7px] overflow-hidden">

        <div
          className="flex-shrink-0 mx-auto xl:mx-0 flex items-center justify-center"
          style={{ width: 210, height: 210 }}
        >
          <div style={{ transform: 'scale(1.1)', transformOrigin: 'center' }}>
            <DonutChart
              size={190}
              centerValue={`${ya.percentage}%`}
              centerLabel="Penerima"
              segments={[
                { value: ya.value, color: '#10B981' },
                { value: tidak.value, color: '#CBD5E1' },
              ]}
            />
          </div>
        </div>

        <div className="hidden xl:block w-px self-stretch bg-slate-100 flex-shrink-0" />
        <div className="xl:hidden h-px w-full bg-slate-100 flex-shrink-0" />

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="space-y-5">
            <DonutLegend
              label="Penerima"
              value={ya.value}
              percentage={ya.percentage}
              color="#10B981"
            />
            <DonutLegend
              label="Tidak Menerima"
              value={tidak.value}
              percentage={tidak.percentage}
              color="#CBD5E1"
            />
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 break-words">
              {ya.value.toLocaleString('id-ID')} dari{' '}
              {total.toLocaleString('id-ID')} jiwa menerima bantuan
            </p>
          </div>
        </div>

      </div>
    </DemoCard>
  );
}

function BPJSPanel({ data }: { data: ChartDataPoint[] }) {
  /* Fix: removed stacked bar — only horizontal bars, no duplication */
  const maxV = data[0]?.value ?? 1;

  return (
    <DemoCard title="Kepesertaan BPJS" subtitle="Jenis kepesertaan BPJS kesehatan">
      <div className="space-y-3">
        {data.map((item, i) => (
          <HBar
            key={item.name}
            label={item.name}
            value={item.value}
            pct={item.percentage}
            color={BPJS_COLORS[i % BPJS_COLORS.length]}
            maxVal={maxV}
          />
        ))}
      </div>
    </DemoCard>
  );
}

function StatusPanel({ data }: { data: ChartDataPoint[] }) {
  const maxV = data[0]?.value ?? 1;

  return (
    <DemoCard title="Status Keluarga" subtitle="Distribusi peran dalam keluarga">
      <div className="space-y-3">
        {data.slice(0, 5).map((item, i) => (
          <HBar
            key={item.name}
            label={item.name}
            value={item.value}
            pct={item.percentage}
            color={STAT_COLORS[i % STAT_COLORS.length]}
            maxVal={maxV}
          />
        ))}
      </div>
    </DemoCard>
  );
}

// ── INSIGHT CHIPS ─────────────────────────────────────────────────

const CHIP_TONE = {
  violet:  { bg:'bg-violet-50',  bd:'border-violet-200', ic:'#6D5DFC', tx:'text-violet-900' },
  success: { bg:'bg-emerald-50', bd:'border-emerald-200',ic:'#10B981', tx:'text-emerald-900'},
  warning: { bg:'bg-amber-50',   bd:'border-amber-200',  ic:'#F59E0B', tx:'text-amber-900'  },
  neutral: { bg:'bg-white',      bd:'border-slate-200',  ic:'#94A3B8', tx:'text-slate-800'  },
};

function InsightChip({ insight }: { insight: AutoInsight }) {
  const s = CHIP_TONE[insight.tone];
  return (
    <div className={`rounded-xl border px-4 py-3.5 flex flex-col h-full ${s.bg} ${s.bd}`}>
      <div className="flex items-start gap-3">
        <svg
          className="w-4 h-4 flex-shrink-0 mt-px"
          fill="none"
          viewBox="0 0 24 24"
          stroke={s.ic}
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={insight.path} />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            {insight.label}
          </p>
          <p className={`text-[13px] font-bold leading-snug break-words ${s.tx}`}>
            {insight.value}
          </p>
          <div className="mt-2 pt-2 border-t border-black/5 space-y-0.5">
            <p className="text-[11px] text-slate-500 leading-snug break-words">
              {insight.sub}
            </p>
            {insight.sub2 && (
              <p className="text-[11px] text-slate-400 leading-snug break-words">
                {insight.sub2}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PRIMITIVES ────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[15px] font-semibold text-slate-800 mb-4">{children}</h2>
  );
}

/** Wrapper card for all 4 demographic sections */
function DemoCard({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 flex flex-col ${className}`}
    >
      <div className="mb-4">
        <p className="text-[13px] font-semibold text-slate-700">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div>{children}</div>
    </div>
  );
}

/** Donut Chart */
function DonutChart({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: {
    value: number;
    color: string;
  }[];
  centerValue: string;
  centerLabel: string;
}) {
  const radius = 42;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  const total = segments.reduce(
    (sum, segment) => sum + segment.value,
    0
  );

  let offset = 0;

  return (
    <div className="flex justify-center">
      <div className="relative w-40 h-40">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full -rotate-90"
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />

          {segments.map((segment, index) => {
            const length =
              (segment.value / total) * circumference;

            const element = (
              <circle
                key={index}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${length} ${circumference}`}
                strokeDashoffset={-offset}
              />
            );

            offset += length;

            return element;
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-900">
            {centerValue}
          </span>

          <span className="text-xs text-slate-400">
            {centerLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Donut Legend */
function DonutLegend({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: number;
  percentage: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />

        <span className="text-[12px] text-slate-600">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[12px] font-semibold text-slate-800">
          {value.toLocaleString('id-ID')}
        </span>

        <span className="text-[11px] text-slate-400 w-10 text-right">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

/** Context badge for hero panel */
type BadgeTone = 'neutral' | 'success' | 'warning';

/** Horizontal Bar */
function HBar({
  label,
  value,
  pct,
  color,
  maxVal,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
  maxVal: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />

          <span
            className="text-[12px] text-slate-600 truncate"
            title={label}
          >
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 ml-2">
          <span className="text-[12px] font-semibold text-slate-800 tabular-nums">
            {value.toLocaleString('id-ID')}
          </span>

          <span className="text-[11px] text-slate-400 tabular-nums w-9 text-right">
            {pct}%
          </span>
        </div>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(value / maxVal) * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-700">Gagal memuat dashboard</p>
      <p className="text-xs text-slate-400 mt-1">Coba refresh halaman.</p>
    </div>
  );
}