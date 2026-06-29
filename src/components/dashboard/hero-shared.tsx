import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'success' | 'warning';

export function CtxBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: BadgeTone;
}) {
  const t = {
    neutral: 'bg-slate-50 border-slate-200 text-slate-600',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${t}`}
    >
      {tone === 'success' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
      )}
      {children}
    </span>
  );
}

export function QuickFact({
  label,
  value,
  pct,
  suffix = 'warga',
}: {
  label: string;
  value: string;
  pct: string;
  suffix?: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
        {label}
      </p>
      <p
        className="text-sm font-bold text-slate-800 truncate leading-tight"
        title={value}
      >
        {value}
      </p>
      <p className="text-[11px] text-slate-400 mt-0.5">
        {pct} {suffix}
      </p>
    </div>
  );
}