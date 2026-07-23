'use client';

import { useState } from 'react';

interface Props {
  isExpanded: boolean;
  isLinking: boolean;
  isEditing: boolean;
  canDelete: boolean;
  isDeleting: boolean;

  onToggleExpand: () => void;
  onToggleLinking: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
}

export default function MobileActionMenu({
  isExpanded,
  isLinking,
  isEditing,
  canDelete,
  isDeleting,
  onToggleExpand,
  onToggleLinking,
  onToggleEdit,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-lg font-bold text-slate-700 shadow-sm"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

          <button
            type="button"
            onClick={() => {
              onToggleLinking();
              setOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {isLinking
              ? 'Tutup tambah anggota'
              : 'Tambah anggota'}
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleEdit();
              setOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {isEditing
              ? 'Tutup edit'
              : 'Edit keluarga'}
          </button>

          {canDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              disabled={isDeleting}
              className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              {isDeleting
                ? 'Menghapus...'
                : 'Hapus keluarga'}
            </button>
          )}

        </div>
      )}

    </div>
  );
}