'use client';

import type { KeluargaListRow } from '@/lib/keluarga-service';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';
import MobileActionMenu from './MobileActionMenu';

interface Props {
  item: KeluargaListRow;
  isExpanded: boolean;
  isLinking: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  canDelete: boolean;

  onToggleExpand: () => void;
  onToggleLinking: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
}

export default function MobileKeluargaCard({
  item,
  isExpanded,
  isLinking,
  isEditing,
  isDeleting,
  canDelete,
  onToggleExpand,
  onToggleLinking,
  onToggleEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <button
          type="button"
          onClick={onToggleExpand}
          className="flex w-full items-start justify-between text-left"
        >

      <div>
        <h3 className="text-lg font-bold text-slate-900">
          {item.kepala_keluarga_nama ??
            item.nama_keluarga}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {item.rt}
        </p>

      </div>

      <div className="flex items-center gap-2">

        <StatusBadge
          status={item.status_keluarga}
        />

        <span className="text-sm font-bold text-slate-500">
          {isExpanded ? '▲' : '▼'}
        </span>

    </div>

</button>

      <div className="mt-5 space-y-2 text-sm">

        <div>
          <span className="font-semibold text-slate-700">
            📍 Alamat
          </span>

          <p className="mt-1 text-base font-medium text-slate-900">
            {item.alamat}
          </p>
        </div>

        <div>
          <span className="font-semibold text-slate-700">
            👥 Jumlah Anggota
          </span>

          <p className="mt-1 text-base font-medium text-slate-900">
            {item.jumlah_anggota} orang
          </p>
        </div>

      </div>

      <div className="mt-6 flex justify-end border-t pt-4">
        <MobileActionMenu
          isExpanded={isExpanded}
          isLinking={isLinking}
          isEditing={isEditing}
          isDeleting={isDeleting}
          canDelete={canDelete}
          onToggleExpand={onToggleExpand}
          onToggleLinking={onToggleLinking}
          onToggleEdit={onToggleEdit}
          onDelete={onDelete}
        />
      </div>

    </div>
  );
}