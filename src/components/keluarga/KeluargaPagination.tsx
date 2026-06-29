'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  KELUARGA_PAGE_SIZE,
} from '@/lib/keluarga-service';
import {
  buildKeluargaURL,
  type KeluargaURLParams,
} from '@/lib/keluarga-utils';

interface KeluargaPaginationProps {
  total: number;
  page: number;
  urlParams: KeluargaURLParams;
}

export default function KeluargaPagination({
  total,
  page,
  urlParams,
}: KeluargaPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / KELUARGA_PAGE_SIZE);

  function goToPage(targetPage: number) {
    if (
      targetPage < 1 ||
      targetPage > totalPages ||
      targetPage === page
    ) {
      return;
    }

    startTransition(() => {
      router.push(
        buildKeluargaURL(pathname, urlParams, targetPage > 1 ? targetPage : undefined)
      );
    });
  }

  if (total === 0) return null;

  const start = (page - 1) * KELUARGA_PAGE_SIZE + 1;
  const end = Math.min(page * KELUARGA_PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="order-2 text-xs text-slate-400 sm:order-1">
        Menampilkan{' '}
        <span className="font-semibold text-slate-600">
          {start}–{end}
        </span>{' '}
        dari{' '}
        <span className="font-semibold text-slate-600">
          {total.toLocaleString('id-ID')}
        </span>{' '}
        keluarga
      </p>

      {totalPages > 1 && (
        <div className="order-1 flex items-center gap-1 sm:order-2">
          <NavButton
            onClick={() => goToPage(page - 1)}
            disabled={page === 1 || isPending}
            label="Sebelumnya"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </NavButton>

          {getPageNumbers(page, totalPages).map((p, i) =>
            p === null ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 text-center text-xs text-slate-300"
              >
                …
              </span>
            ) : (
              <PageButton
                key={p}
                page={p}
                active={p === page}
                disabled={isPending}
                onClick={() => goToPage(p)}
              />
            )
          )}

          <NavButton
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages || isPending}
            label="Berikutnya"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </NavButton>
        </div>
      )}
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, null, total];
  }

  if (current >= total - 3) {
    return [1, null, total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, null, current - 1, current, current + 1, null, total];
}

function NavButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function PageButton({
  page,
  active,
  disabled,
  onClick,
}: {
  page: number;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || active}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-all ${
        active
          ? 'border-indigo-600 bg-indigo-600 text-white'
          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
      } disabled:cursor-not-allowed`}
    >
      {page}
    </button>
  );
}