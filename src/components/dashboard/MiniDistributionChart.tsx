'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '@/lib/dashboard-service';

const DEFAULT_COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
  '#f59e0b', '#f43f5e', '#94a3b8',
];

interface Props {
  title:      string;
  subtitle?:  string;
  data:       ChartDataPoint[];
  variant:    'pie' | 'donut';
  colorMap?:  Record<string, string>;
  colorList?: string[];
}

function resolveColor(
  name: string,
  index: number,
  colorMap?: Record<string, string>,
  colorList?: string[]
): string {
  if (colorMap?.[name]) return colorMap[name];
  const list = colorList ?? DEFAULT_COLORS;
  return list[index % list.length];
}

export function MiniDistributionChart({
  title, subtitle, data, variant, colorMap, colorList,
}: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-sm font-semibold text-slate-400">{title}</p>
        <p className="text-xs text-slate-300 mt-1">Tidak ada data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[13px] font-semibold text-slate-700">{title}</h3>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Chart */}
      <div className="relative h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={variant === 'donut' ? 52 : 0}
              outerRadius={80}
              paddingAngle={variant === 'donut' ? 4 : 2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={resolveColor(entry.name, i, colorMap, colorList)}
                />
              ))}
            </Pie>
            <Tooltip content={<MiniTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label (donut only) */}
        {variant === 'donut' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <p className="text-xl font-bold text-slate-900 tabular-nums leading-none">
              {total.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">jiwa</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: resolveColor(item.name, i, colorMap, colorList),
                }}
              />
              <span
                className="text-[11px] text-slate-600 truncate"
                title={item.name}
              >
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
              <span className="text-[11px] font-semibold text-slate-800 tabular-nums">
                {item.value.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-slate-400 tabular-nums w-10 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MiniTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d: ChartDataPoint = payload[0].payload;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm px-3 py-2">
      <p className="text-xs font-semibold text-slate-700">{d.name}</p>
      <p className="text-[11px] text-slate-500 mt-0.5">
        {d.value.toLocaleString('id-ID')} jiwa · {d.percentage}%
      </p>
    </div>
  );
}