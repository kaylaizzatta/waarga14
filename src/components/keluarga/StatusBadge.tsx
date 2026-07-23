'use client';

interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {

  const normalized =
    (status ?? '').toLowerCase();

  const styleMap: Record<
    string,
    string
  > = {

    aktif:
      'bg-emerald-50 text-emerald-700',

    pindah:
      'bg-amber-50 text-amber-700',

    nonaktif:
      'bg-slate-100 text-slate-700',

    kosong:
      'bg-rose-50 text-rose-700',

  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styleMap[normalized] ??
        'bg-slate-100 text-slate-700'
      }`}
    >
      {status || '-'}
    </span>
  );
}