"use client";

import { ReactNode } from "react";

export default function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

      <div className="border-b border-slate-100 px-5 py-3.5">
        <p className="text-[13px] font-semibold text-slate-700">
          {title}
        </p>
      </div>

      <div className="p-5">

        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          {children}
        </div>

      </div>

    </div>
  );
}