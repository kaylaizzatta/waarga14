'use client';

import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':            'Dashboard',
  '/dashboard/data-warga': 'Data Warga',
  '/dashboard/statistik':  'Statistik',
  '/dashboard/pengaturan': 'Pengaturan',
};

interface Props {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: Props) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center gap-4 px-6 flex-shrink-0">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Buka navigasi"
        className="p-2 -ml-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors lg:hidden"
      >
        <IconMenu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h2 className="text-sm font-semibold text-slate-700 flex-1">{title}</h2>

      {/* Logout */}
      <LogoutButton className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors duration-150" />
    </header>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}