'use client';

import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PAGE_SIZE } from '@/lib/warga-service';
import { type WargaURLParams, buildWargaURL } from '@/lib/warga-utils';

interface Props {
  total:     number;
  page:      number;
  urlParams: WargaURLParams;   // ← sebelumnya currentSearch + currentRt
}

export function DataWargaPagination({ total, page, urlParams }: Props) {
  const router    = useRouter();
  const pathname  = usePathname();
  const [isPending, startTransition] = useTransition();
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function goToPage(p: number) {
    if (p < 1 || p > totalPages || p === page) return;
    startTransition(() => {
      router.push(buildWargaURL(pathname, urlParams, p > 1 ? p : undefined));
    });
  }

  const start = (page - 1) * PAGE_SIZE + 1;
  const end   = Math.min(page * PAGE_SIZE, total);

  if (total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-slate-400 order-2 sm:order-1">
        Menampilkan{' '}
        <span className="font-semibold text-slate-600">{start}–{end}</span>
        {' '}dari{' '}
        <span className="font-semibold text-slate-600">{total.toLocaleString('id-ID')}</span>
        {' '}warga
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1 order-1 sm:order-2">
          <NavButton onClick={() => goToPage(page - 1)} disabled={page === 1 || isPending} label="Sebelumnya">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </NavButton>

          {getPageNumbers(page, totalPages).map((p, i) =>
            p === null ? (
              <span key={`e-${i}`} className="w-8 text-center text-xs text-slate-300">…</span>
            ) : (
              <PageButton key={p} page={p} active={p === page} disabled={isPending} onClick={() => goToPage(p)} />
            )
          )}

          <NavButton onClick={() => goToPage(page + 1)} disabled={page === totalPages || isPending} label="Berikutnya">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </NavButton>
        </div>
      )}
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4)        return [1, 2, 3, 4, 5, null, total];
  if (current >= total - 3) return [1, null, total - 4, total - 3, total - 2, total - 1, total];
  return [1, null, current - 1, current, current + 1, null, total];
}

function NavButton({ children, onClick, disabled, label }: {
  children: React.ReactNode; onClick: () => void; disabled: boolean; label: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 border border-slate-200 hover:border-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
      {children}
    </button>
  );
}

function PageButton({ page, active, disabled, onClick }: {
  page: number; active: boolean; disabled: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} disabled={disabled || active}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-indigo-600 text-white border border-indigo-600'
          : 'text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
      } disabled:cursor-not-allowed`}>
      {page}
    </button>
  );
}