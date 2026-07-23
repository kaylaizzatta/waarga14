'use client';

import Link from 'next/link';

interface Props {
  loading?: boolean;
}

export default function ActionButtons({
  loading = false,
}: Props) {
  return (
    <div className="flex justify-end gap-3 pt-6">

      <Link
        href="/dashboard/pencatatan"
        className="
          rounded-xl
          border
          border-slate-300
          px-5
          py-3
          text-sm
          font-semibold
          text-slate-700
          hover:bg-slate-50
        "
      >
        Batal
      </Link>

      <button
        type="submit"
        disabled={loading}
        className="
          rounded-xl
          bg-violet-600
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          hover:bg-violet-700
          disabled:opacity-50
        "
      >
        {loading ? 'Menyimpan...' : 'Simpan Keluarga'}
      </button>

    </div>
  );
}