import { Home, Link2, AlertTriangle, Users } from 'lucide-react';
import type { KeluargaSummary as KeluargaSummaryType } from '@/lib/keluarga-service';

interface KeluargaSummaryProps {
  summary: KeluargaSummaryType;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
}

function StatCard({
  title,
  value,
  icon,
  iconBgClass = 'bg-slate-100',
  iconColorClass = 'text-slate-600',
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>
          <h3 className="mt-4 text-4xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className={`rounded-2xl p-3 ${iconBgClass}`}>
          <div className={iconColorClass}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

export default function KeluargaSummary({ summary }: KeluargaSummaryProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Keluarga"
        value={summary.totalKeluarga}
        icon={<Home className="h-5 w-5" />}
        iconBgClass="bg-violet-50"
        iconColorClass="text-violet-600"
      />

      <StatCard
        title="Warga Terhubung"
        value={summary.wargaTerhubung}
        icon={<Link2 className="h-5 w-5" />}
        iconBgClass="bg-blue-50"
        iconColorClass="text-blue-600"
      />

      <StatCard
        title="Belum Terhubung"
        value={summary.wargaBelumTerhubung}
        icon={<AlertTriangle className="h-5 w-5" />}
        iconBgClass="bg-amber-50"
        iconColorClass="text-amber-600"
      />
    </div>
  );
}