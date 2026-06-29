import { ComingSoon } from '@/components/ui/ComingSoon';

export default function StatistikPendidikanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Statistik Pendidikan</h1>
        <p className="text-sm text-slate-500 mt-1">
          Distribusi tingkat pendidikan warga
        </p>
      </div>
      <ComingSoon />
    </div>
  );
}
