import type { ChartDataPoint } from '@/lib/dashboard-service';

interface Props {
  title:     string;
  subtitle?: string;
  data:      ChartDataPoint[];
}

export function BantuanSosialCard({ title, subtitle, data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (!data.length || total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-sm font-semibold text-slate-400">{title}</p>
        <p className="text-xs text-slate-300 mt-1">Tidak ada data tersedia</p>
      </div>
    );
  }

  const penerima    = data.find(d => d.name === 'Ya');
  const nonPenerima = data.find(d => d.name === 'Tidak');

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-[13px] font-semibold text-slate-700">{title}</h3>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Progress bars */}
      <div className="flex-1 space-y-5">

        {penerima && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">Penerima Bantuan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {penerima.value.toLocaleString('id-ID')}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full min-w-[42px] text-center">
                  {penerima.percentage}%
                </span>
              </div>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${penerima.percentage}%` }}
              />
            </div>
          </div>
        )}

        {nonPenerima && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">Tidak Menerima</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {nonPenerima.value.toLocaleString('id-ID')}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full min-w-[42px] text-center">
                  {nonPenerima.percentage}%
                </span>
              </div>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-300 rounded-full"
                style={{ width: `${nonPenerima.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer summary */}
      {penerima && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            <span className="font-semibold text-slate-600">
              {penerima.value.toLocaleString('id-ID')}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-slate-600">
              {total.toLocaleString('id-ID')}
            </span>{' '}
            warga tercatat menerima bantuan sosial
          </p>
        </div>
      )}
    </div>
  );
}