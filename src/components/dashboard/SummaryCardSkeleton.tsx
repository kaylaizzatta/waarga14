export function SummaryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-5">
        <div className="h-2.5 w-20 bg-slate-100 rounded-full animate-pulse" />
        <div className="w-9 h-9 bg-slate-100 rounded-xl animate-pulse" />
      </div>
      <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
      <div className="h-2.5 w-28 bg-slate-100 rounded-full animate-pulse mt-3" />
    </div>
  );
}