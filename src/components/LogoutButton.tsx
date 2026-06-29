'use client';

import { logoutAction } from '@/actions/auth';
import { useFormStatus } from 'react-dom';

// ── Inner button — harus child dari <form> agar useFormStatus bekerja ──
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        'group flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5',
        'text-sm font-semibold text-white',
        'bg-red-500 hover:bg-red-600 active:bg-red-700',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'transition-colors duration-150',
      ].join(' ')}
    >
      {/* Ikon logout (arrow-right-on-rectangle) */}
      {pending ? (
        // Spinner saat proses logout
        <svg
          className="w-4 h-4 flex-shrink-0 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        // Ikon pintu keluar
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      )}

      <span>{pending ? 'Keluar...' : 'Keluar'}</span>
    </button>
  );
}

// ── Komponen publik ───────────────────────────────────────────────
export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction} className={className}>
      <SubmitButton />
    </form>
  );
}
