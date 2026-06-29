import type { WargaPageStats } from '@/lib/warga-service';

interface Props {
  stats: WargaPageStats;
}

export function DataWargaSummary({ stats }: Props) {
  const cards = [
    {
      label: 'Total Warga',
      value: stats.totalWarga,
      icon: <IconUsers className="w-4 h-4 text-indigo-500" />,
      bg: 'bg-indigo-50',
    },
    {
      label: 'Laki-laki',
      value: stats.totalLaki,
      icon: <IconPerson className="w-4 h-4 text-blue-500" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Perempuan',
      value: stats.totalPerempuan,
      icon: <IconPerson className="w-4 h-4 text-rose-500" />,
      bg: 'bg-rose-50',
    },
    {
      label: 'Kepala Keluarga',
      value: stats.totalKK,
      icon: <IconHome className="w-4 h-4 text-amber-500" />,
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map(({ label, value, icon, bg }) => (
        <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              {label}
            </p>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bg}`}>
              {icon}
            </div>
          </div>
          <p className="text-[1.75rem] font-semibold text-slate-900 tracking-tight leading-none">
            {value.toLocaleString('id-ID')}
          </p>
        </div>
      ))}
    </div>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0Zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0Z" />
    </svg>
  );
}

function IconPerson({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}