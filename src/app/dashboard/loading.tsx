import { SummaryCardSkeleton } from '@/components/dashboard/SummaryCardSkeleton';

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8 space-y-2.5">
        <div className="h-6 w-36 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}