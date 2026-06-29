interface Props {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
}

export function SummaryCard({ title, value, description, icon, iconBg }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 leading-tight">
          {title}
        </p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="text-[2rem] font-semibold text-slate-900 tracking-tight leading-none">
        {value.toLocaleString('id-ID')}
      </p>
      <p className="text-xs text-slate-400 mt-2">{description}</p>
    </div>
  );
}