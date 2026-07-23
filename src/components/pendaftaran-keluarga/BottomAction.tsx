export default function BottomAction() {
  return (
    <div className="flex justify-end gap-3">

      <button
        className="rounded-xl border border-slate-300 px-6 py-3 font-medium"
      >
        Batal
      </button>

      <button
        className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
      >
        Simpan Keluarga
      </button>

    </div>
  );
}