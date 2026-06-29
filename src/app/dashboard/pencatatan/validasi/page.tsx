import Link from 'next/link';

export default function ValidasiKualitasDataPage() {
  return (
    <div className="space-y-6">

      {/* Header + breadcrumb */}
      <div>
        <Link
          href="/dashboard/pencatatan"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors mb-3"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Pencatatan Digital
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Validasi & Kualitas Data
        </h1>

        <p className="text-sm text-slate-400 mt-0.5">
          Membantu menemukan data warga yang belum lengkap atau memerlukan pembaruan.
        </p>
      </div>

      <div className="h-px bg-slate-100" />

      <div
        className="
          bg-white rounded-2xl border border-slate-200 p-10
          flex flex-col items-center justify-center text-center gap-4
        "
      >
        <div
          className="
            w-12 h-12 rounded-2xl bg-indigo-50
            flex items-center justify-center text-indigo-500
          "
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
        </div>

        <div>
          <p className="text-[14px] font-semibold text-slate-700">
            Dalam Pengembangan
          </p>

          <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
            Halaman ini nantinya digunakan untuk membantu pengurus menemukan
            data warga yang belum lengkap, tidak konsisten, atau memerlukan
            pembaruan agar kualitas data administrasi tetap terjaga.
          </p>
        </div>

        <span
          className="
            text-[10px] font-bold tracking-wide px-2.5 py-1
            rounded-full bg-amber-50 border border-amber-200 text-amber-600
          "
        >
          Coming Soon
        </span>
      </div>
    </div>
  );
}