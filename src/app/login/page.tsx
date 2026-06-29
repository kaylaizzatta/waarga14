'use client';

import { useActionState, useState } from 'react';
import { loginAction } from '@/actions/auth';
import type { LoginState } from '@/lib/types';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null as LoginState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex bg-white">

      {/* ══ LEFT — Form ══ */}
      <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 flex flex-col justify-center px-8 sm:px-12 lg:px-10 xl:px-16 py-12 lg:border-r lg:border-slate-100">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
            <BuildingIcon className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold text-slate-900">Sistem Warga</p>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-400">
              RW 14
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-[26px] font-semibold text-slate-900 tracking-tight leading-tight mb-1.5">
            Masuk ke Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Masukkan kredensial untuk mengakses sistem
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-[13px] font-medium text-slate-600 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck="false"
              required
              disabled={isPending}
              placeholder="Masukkan username"
              className="
                w-full rounded-xl border border-slate-200 px-4 py-3
                text-sm text-slate-900 placeholder:text-slate-300
                outline-none transition-all
                focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[13px] font-medium text-slate-600 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                disabled={isPending}
                placeholder="Masukkan password"
                className="
                  w-full rounded-xl border border-slate-200 px-4 py-3 pr-12
                  text-sm text-slate-900 placeholder:text-slate-300
                  outline-none transition-all
                  focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-slate-500 transition-colors"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Error */}
          {state?.error && (
            <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <svg
                className="w-4 h-4 flex-shrink-0 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-[13px] text-red-600">{state.error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="
              w-full mt-1 rounded-xl bg-indigo-600 hover:bg-indigo-500
              active:bg-indigo-700 text-white py-3
              text-sm font-semibold tracking-wide
              transition-all shadow-sm shadow-indigo-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memverifikasi…
              </span>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-10 text-center text-[11px] text-slate-300">
           Sistem Pencatatan Warga · RW 14
        </p>
      </div>

      {/* ══ RIGHT — Decorative Panel (kosong, diisi nanti) ══ */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100">

        {/* Lingkaran dekoratif */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-indigo-100/50" />
        <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full bg-indigo-200/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-white/20" />

        {/* Placeholder — ganti dengan screenshot dashboard nanti */}
        <div className="relative z-10 text-center px-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm shadow-indigo-100 mb-5">
            <BuildingIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-indigo-300 mb-2">
            Preview Dashboard
          </p>
        </div>

      </div>
    </div>
  );
}

/* ── Icons ── */

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}