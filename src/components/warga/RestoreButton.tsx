'use client';

import { restoreWargaAction } from '@/app/dashboard/data-terhapus/action';

export default function RestoreButton({
  id,
  nama,
}: {
  id: number;
  nama: string;
}) {
  async function handleRestore() {
    const confirmed = window.confirm(
      `Pulihkan data warga "${nama}" ?`
    );

    if (!confirmed) return;

    try {
      await restoreWargaAction(id);

      window.location.reload();
    } catch (err) {
      console.error(err);

      alert('Gagal memulihkan data');
    }
  }

  return (
    <button
      onClick={handleRestore}
      className="
        px-3 py-1.5
        rounded-lg
        text-xs font-semibold
        bg-emerald-50
        text-emerald-700
        hover:bg-emerald-100
        transition-colors
      "
    >
      Pulihkan
    </button>
  );
}