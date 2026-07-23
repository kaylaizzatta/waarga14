'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { UserSession } from '@/lib/types';

// ── Item nav utama ─────────
const TOP_NAV = [
  {href: "/dashboard", label: "Dashboard", Icon: IconGrid, exact: true,},
  {href: "/dashboard/pencatatan", label: "Pencatatan Digital", Icon: IconDocument, exact: false,},
  {href: "/dashboard/data-warga", label: "Data Warga", Icon: IconUsers, exact: false,},
  {href: "/dashboard/data-keluarga", label: "Data Keluarga", Icon: IconHome, exact: false,},
  {href: "/dashboard/data-terhapus", label: "Data Terhapus", Icon: IconTrash,exact: false,},
];

interface Props {
  session: UserSession;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ session, open, onClose }: Props) {
  const pathname      = usePathname();
  const isRW          = session.role === 'RW';

  /** Kelas active / inactive untuk item nav utama */
  const onCls  = 'bg-indigo-50 text-indigo-700 font-semibold border-l-2 border-indigo-400 -ml-px pl-[11px]';
  const offCls = 'text-slate-500 hover:bg-slate-50/70 hover:text-slate-700 border-l-2 border-transparent -ml-px pl-[11px]';
  const base   = 'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150';

  function iconCls(isOn: boolean) {
    return `w-[18px] h-[18px] flex-shrink-0 transition-colors ${
      isOn ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'
    }`;
  }

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col
        bg-white border-r border-slate-100
        lg:relative lg:inset-y-auto lg:left-auto lg:z-auto
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-100 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
          <IconBuilding className="w-4 h-4 text-white" />
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-[13px] font-bold text-slate-900 truncate">Sistem Warga</p>
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-400">RW 14</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {/* Dashboard */}
        {(() => {
          const item = TOP_NAV[0];
          const isOn = pathname === item.href;

          return (
            <>
              <Link
                href={item.href}
                onClick={onClose}
                className={`${base} ${isOn ? onCls : offCls}`}
              >
                <item.Icon className={iconCls(isOn)} />
                {item.label}
              </Link>

              {/* garis setelah dashboard */}
              <div className="my-3 border-t border-slate-100" />
            </>
          );
        })()}

        {/* Menu Utama */}
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          MENU UTAMA
        </p>

        {TOP_NAV.slice(1).map(({ href, label, Icon, exact }) => {
          const isOn = exact ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`${base} ${isOn ? onCls : offCls}`}
            >
              <Icon className={iconCls(isOn)} />
              {label}
            </Link>
          );
        })}

        {/* garis sebelum sistem */}
        <div className="my-5 border-t border-slate-100" />

        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          SISTEM
        </p>

        {(() => {
          const isOn = pathname.startsWith("/dashboard/pengaturan");

          return (
            <Link
              href="/dashboard/pengaturan"
              onClick={onClose}
              className={`${base} ${isOn ? onCls : offCls}`}
            >
              <IconSettings className={iconCls(isOn)} />
              Pengaturan
            </Link>
          );
        })()}

      </nav>

      {/* ── Info Akun ─────────────────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-slate-100 flex-shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">
          Info Akun
        </p>
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-slate-50">
          <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
            <IconPerson className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-slate-700 truncate leading-tight">
              {session.username}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
              {isRW ? 'Ketua RW' : 'Ketua RT'}
            </p>
          </div>
          <span className={`
            flex-shrink-0 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full
            ${isRW ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}
          `}>
            {session.role}
          </span>
        </div>
      </div>
    </aside>
  );
}

/* ── Icons ──────────────────────────────────────────────────────── */

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function IconDocument({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75 10.5 4.5a2.25 2.25 0 0 1 3 0l8.25 8.25M4.5 10.5v8.25A2.25 2.25 0 0 0 6.75 21h3.75v-4.5c0-.621.504-1.125 1.125-1.125h.75c.621 0 1.125.504 1.125 1.125V21h3.75a2.25 2.25 0 0 0 2.25-2.25V10.5"
      />
    </svg>
  );
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function IconPerson({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 7.5h12M9.75 3.75h4.5M10.5 10.5v6m3-6v6M5.25 7.5l.54 10.79A2.25 2.25 0 0 0 8.03 20.5h7.94a2.25 2.25 0 0 0 2.24-2.21L18.75 7.5"
      />
    </svg>
  );
}