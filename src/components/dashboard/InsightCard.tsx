import type { TopInsight } from '@/lib/dashboard-service';

type Variant = 'indigo' | 'violet';

const VARIANT_STYLES: Record<Variant, {
  iconBg: string;
  badgeBg: string;
  badgeText: string;
  bar: string;
}> = {
  indigo: {
    iconBg:    'bg-indigo-50',
    badgeBg:   'bg-indigo-50',
    badgeText: 'text-indigo-700',
    bar:       'bg-indigo-500',
  },
  violet: {
    iconBg:    'bg-violet-50',
    badgeBg:   'bg-violet-50',
    badgeText: 'text-violet-700',
    bar:       'bg-violet-500',
  },
};

interface Props {
  title:   string;
  insight: TopInsight | null;
  variant: Variant;
  icon:    React.ReactNode;
}

export function InsightCard({ title, insight, variant, icon }: Props) {
  const s = VARIANT_STYLES[variant];

  if (!insight) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[140px]">
        <p className="text-xs text-slate-300">Tidak ada data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
          {icon}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          {title}
        </p>
      </div>

      {/* Main value */}
      <p className="text-[1.6rem] font-bold text-slate-900 leading-tight truncate mb-3">
        {insight.name}
      </p>

      {/* Count + percentage */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-slate-500">
          {insight.value.toLocaleString('id-ID')} warga
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badgeBg} ${s.badgeText}`}>
          {insight.percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${s.bar}`}
          style={{ width: `${Math.min(insight.percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}