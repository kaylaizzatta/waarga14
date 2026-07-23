'use client';

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

export default function ActionButtons({
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
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">

      <button
        type="button"
        onClick={onToggleExpand}
        className="rounded-lg px-2 py-1 text-sm font-semibold text-violet-600 hover:bg-violet-50"
      >
        {isExpanded ? 'Sembunyikan anggota' : 'Lihat anggota'}
      </button>

      <button
        type="button"
        onClick={onToggleLinking}
        className="rounded-lg px-2 py-1 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
      >
        {isLinking ? 'Tutup tambah anggota' : 'Tambah anggota'}
      </button>

      <button
        type="button"
        onClick={onToggleEdit}
        className="rounded-lg px-2 py-1 text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        {isEditing ? 'Tutup Edit' : 'Edit'}
      </button>

      {canDelete && (
        <button
          type="button"
          disabled={isDeleting}
          onClick={onDelete}
          className="rounded-lg px-2 py-1 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {isDeleting ? 'Menghapus...' : 'Hapus'}
        </button>
      )}

    </div>
  );
}