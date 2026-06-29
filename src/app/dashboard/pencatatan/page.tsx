import Link from 'next/link';
 
const ACTIONS = [
  {
    id:          'tambah',
    href:        '/dashboard/pencatatan/tambah',
    title:       'Tambah Warga',
    description: 'Menambahkan data warga baru ke dalam sistem.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
      </svg>
    ),
  },
  {
    id:          'perbarui',
    href:        '/dashboard/data-warga',
    title:       'Perbarui Data Warga',
    description: 'Akses data warga untuk mencari, melihat, dan memperbarui informasi warga.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
  },
  {
    id:          'riwayat',
    href:        '/dashboard/pencatatan/riwayat',
    title:       'Riwayat Perubahan',
    description: 'Menampilkan aktivitas perubahan data warga yang dilakukan oleh pengurus.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    id:          'validasi',
    href:        '/dashboard/pencatatan/validasi',
    title:       'Validasi & Kualitas Data',
    description: 'Membantu menemukan data warga yang belum lengkap atau memerlukan pembaruan.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
] as const;
 
export default function PencatatanPage() {
  return (
    <div className="space-y-6">
 
      {/* ── Header ── */}
      <header>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Pencatatan Digital
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Kelola administrasi dan pemutakhiran data warga secara terpusat.
        </p>
      </header>
 
      <div className="h-px bg-slate-100" />
 
      {/* ── Action cards ── */}
      <div>
        <h2 className="text-[15px] font-semibold text-slate-800 mb-4">
          Modul Administrasi
        </h2>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACTIONS.map((action) => (
            <Link
              key={action.id}
              href={action.href}
              className="group bg-white rounded-2xl border border-slate-200 p-5
                         hover:border-indigo-200 hover:shadow-sm
                         transition-all duration-150 block"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4
                              bg-indigo-50 text-indigo-600
                              group-hover:bg-indigo-100 transition-colors duration-150">
                {action.icon}
              </div>
 
              {/* Title + arrow */}
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <p className="text-[14px] font-semibold text-slate-800 leading-snug">
                  {action.title}
                </p>
                <svg
                  className="w-4 h-4 text-slate-300 flex-shrink-0
                             group-hover:text-indigo-400 group-hover:translate-x-0.5
                             transition-all duration-150"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
 
              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
 
      {/* ── Info note ── */}
      <div className="flex items-start gap-3 bg-slate-50 border border-slate-200
                      rounded-xl px-4 py-3.5">
        <svg
          className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-500"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <p className="text-xs text-slate-500 leading-relaxed">
          Seluruh proses pencatatan dan pemutakhiran data warga dilakukan melalui modul ini untuk menjaga konsistensi data administrasi RW.
        </p>
      </div>
 
    </div>
  );
}