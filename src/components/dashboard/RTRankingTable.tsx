import type { RTRankingRow } from '@/lib/dashboard-service';

interface Props {
  data: RTRankingRow[];
}

const RANK_BADGE = [
  'bg-indigo-600 text-white',
  'bg-indigo-100 text-indigo-700',
  'bg-slate-100  text-slate-500',
  'bg-slate-100  text-slate-500',
];

export function RTRankingTable({ data }: Props) {
  const maxWarga = Math.max(...data.map(r => r.totalWarga), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

      {/* Table header */}
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-[13px] font-semibold text-slate-700">Perbandingan RT</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Diurutkan berdasarkan jumlah warga terbanyak
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {[
                { label: '#',                align: 'text-center', w: 'w-16'  },
                { label: 'Wilayah RT',       align: 'text-left',   w: 'w-auto'},
                { label: 'Jumlah Warga',     align: 'text-right',  w: 'w-32'  },
                { label: 'Kepala Keluarga',  align: 'text-right',  w: 'w-32'  },
                { label: 'Penerima Bantuan', align: 'text-right',  w: 'w-36'  },
              ].map(({ label, align, w }) => (
                <th
                  key={label}
                  className={`
                    ${w} px-5 py-3
                    text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400
                    whitespace-nowrap ${align}
                  `}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row, i) => (
              <tr key={row.rt} className="hover:bg-slate-50/50 transition-colors">

                {/* Rank badge */}
                <td className="px-5 py-4 text-center">
                  <span className={`
                    inline-flex items-center justify-center w-7 h-7 rounded-full
                    text-xs font-bold
                    ${RANK_BADGE[i] ?? RANK_BADGE[RANK_BADGE.length - 1]}
                  `}>
                    {i + 1}
                  </span>
                </td>

                {/* RT name + mini bar */}
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-800">{row.rt}</p>
                  <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden w-24">
                    <div
                      className="h-full bg-indigo-400 rounded-full"
                      style={{ width: `${(row.totalWarga / maxWarga) * 100}%` }}
                    />
                  </div>
                </td>

                {/* Warga */}
                <td className="px-5 py-4 text-right">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    {row.totalWarga.toLocaleString('id-ID')}
                  </span>
                </td>

                {/* KK */}
                <td className="px-5 py-4 text-right">
                  <span className="text-sm text-slate-600 tabular-nums">
                    {row.totalKK.toLocaleString('id-ID')}
                  </span>
                </td>

                {/* Bantuan */}
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm text-slate-600 tabular-nums">
                      {row.totalBantuan.toLocaleString('id-ID')}
                    </span>
                    {row.totalWarga > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        {((row.totalBantuan / row.totalWarga) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}