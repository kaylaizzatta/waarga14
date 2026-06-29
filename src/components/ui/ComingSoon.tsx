interface Props {
  label?: string;
  description?: string;
}

export function ComingSoon({
  label = 'Fitur ini',
  description = 'Akan tersedia di tahap pengembangan berikutnya.',
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-5">
        <svg
          className="w-5 h-5 text-slate-300"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}