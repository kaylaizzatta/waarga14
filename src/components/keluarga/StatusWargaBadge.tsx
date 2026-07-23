'use client';

interface Props {
  status: string | null;
}

export default function StatusWargaBadge({
  status,
}: Props) {

  const value = (status ?? '').trim();

  if (!value) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        -
      </span>
    );
  }

  const normalized =
    value.toLowerCase();

  const styleMap: Record<
    string,
    string
  > = {
    aktif:
      'bg-emerald-50 text-emerald-700',

    pindah:
      'bg-amber-50 text-amber-700',

    meninggal:
      'bg-rose-50 text-rose-700',

    nonaktif:
      'bg-slate-100 text-slate-700',
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styleMap[normalized] ??
        'bg-slate-100 text-slate-700'
      }`}
    >
      {value}
    </span>
  );
}