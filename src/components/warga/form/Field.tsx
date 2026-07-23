"use client";

import { ReactNode } from "react";

export default function Field({
  label,
  required = false,
  full = false,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-[12px] font-semibold tracking-wide text-slate-600">
        {label}
        {required && (
          <span className="ml-0.5 text-red-400">*</span>
        )}
      </label>

      {children}
    </div>
  );
}