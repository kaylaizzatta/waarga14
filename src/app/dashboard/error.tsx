'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DashboardError]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <svg
          className="w-6 h-6 text-red-400"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1.5">Terjadi Kesalahan</h3>
      <p className="text-xs text-slate-400 mb-6 max-w-xs leading-relaxed">
        Gagal memuat data dari server. Periksa koneksi internet dan coba lagi.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}