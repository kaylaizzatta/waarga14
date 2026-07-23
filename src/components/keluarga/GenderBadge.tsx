'use client';

interface Props {
  gender: string | null;
}

export default function GenderBadge({
  gender,
}: Props) {

  const value = (gender ?? '')
    .trim()
    .toLowerCase();

  if (!value) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        -
      </span>
    );
  }

  const isMale =
    value.includes('laki') ||
    value === 'l' ||
    value === 'male';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isMale
          ? 'bg-sky-50 text-sky-700'
          : 'bg-pink-50 text-pink-700'
      }`}
    >
      {gender}
    </span>
  );
}