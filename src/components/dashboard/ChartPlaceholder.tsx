type ChartVariant = 'bar' | 'donut' | 'horizontal' | 'area';

interface Props {
  title: string;
  subtitle?: string;
  variant?: ChartVariant;
}

export function ChartPlaceholder({
  title,
  subtitle,
  variant = 'bar',
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[13px] font-semibold text-slate-500">{title}</p>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-300 bg-indigo-50 px-2 py-0.5 rounded-full flex-shrink-0">
          Tahap 3
        </span>
      </div>

      {/* Placeholder visual */}
      <div className="mb-4">
        {variant === 'bar'        && <BarPreview />}
        {variant === 'donut'      && <DonutPreview />}
        {variant === 'horizontal' && <HorizontalBarPreview />}
        {variant === 'area'       && <AreaPreview />}
      </div>

      <p className="text-[11px] text-slate-300">
        Visualisasi akan ditampilkan di sini
      </p>
    </div>
  );
}

/* ── Placeholder visuals ─────────────────────────────────────────── */

function BarPreview() {
  const heights = [45, 72, 58, 88, 40, 65, 80];
  return (
    <div className="flex items-end gap-1.5 h-16 px-1">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-[3px] ${i % 2 === 0 ? 'bg-slate-100' : 'bg-slate-150'}`}
          style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? '#f1f5f9' : '#e2e8f0' }}
        />
      ))}
    </div>
  );
}

function HorizontalBarPreview() {
  const widths = [88, 62, 75, 48, 92];
  return (
    <div className="space-y-2 px-1">
      {widths.map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="h-3 rounded-full"
            style={{ width: `${w}%`, backgroundColor: '#e2e8f0' }}
          />
        </div>
      ))}
    </div>
  );
}

function DonutPreview() {
  return (
    <div className="flex items-center justify-center h-16">
      <svg viewBox="0 0 64 64" width="56" height="56">
        {/* Background ring */}
        <circle cx="32" cy="32" r="24" fill="none" stroke="#f1f5f9" strokeWidth="10" />
        {/* Segments */}
        <circle cx="32" cy="32" r="24" fill="none" stroke="#e2e8f0"
          strokeWidth="10" strokeDasharray="45 106" strokeDashoffset="-15" />
        <circle cx="32" cy="32" r="24" fill="none" stroke="#cbd5e1"
          strokeWidth="10" strokeDasharray="28 123" strokeDashoffset="-60" />
        {/* Center hole */}
        <circle cx="32" cy="32" r="17" fill="white" />
      </svg>
    </div>
  );
}

function AreaPreview() {
  return (
    <div className="h-16 px-1 flex items-end">
      <svg viewBox="0 0 200 60" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,55 C20,45 30,30 50,35 C70,40 80,20 100,15 C120,10 140,25 160,20 C180,15 190,30 200,28 L200,60 L0,60 Z"
          fill="url(#areaGrad)"
        />
        <path
          d="M0,55 C20,45 30,30 50,35 C70,40 80,20 100,15 C120,10 140,25 160,20 C180,15 190,30 200,28"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}