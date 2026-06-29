export default function DataWargaLoading() {
  return (
    <div className="animate-pulse">
      {/* Heading skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-6 w-28 bg-slate-100 rounded-lg" />
        <div className="h-4 w-64 bg-slate-100 rounded-lg" />
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-2.5 w-20 bg-slate-100 rounded-full" />
              <div className="w-8 h-8 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-8 w-16 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="h-9 w-60 bg-slate-100 rounded-xl" />
        </div>
        <div className="divide-y divide-slate-50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-5">
              <div className="h-3.5 w-40 bg-slate-100 rounded" />
              <div className="h-5 w-12 bg-slate-100 rounded-full" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
              <div className="h-3.5 w-10 bg-slate-100 rounded" />
              <div className="h-3.5 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-slate-100">
          <div className="h-4 w-52 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}