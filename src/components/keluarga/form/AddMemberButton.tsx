'use client';

interface Props {
  onClick: () => void;
}

export default function AddMemberButton({
  onClick,
}: Props) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-emerald-300
          bg-emerald-50
          px-5
          py-3
          text-sm
          font-semibold
          text-emerald-700
          transition
          hover:bg-emerald-100
        "
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v14m7-7H5"
          />
        </svg>

        Tambah Anggota Keluarga
      </button>
    </div>
  );
}