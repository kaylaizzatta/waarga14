export default function SummarySection() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-lg font-semibold">
        Ringkasan
      </h2>

      <div className="mt-6 space-y-3 text-sm">

        <div className="flex justify-between">
          <span>RT</span>
          <span>-</span>
        </div>

        <div className="flex justify-between">
          <span>Alamat</span>
          <span>-</span>
        </div>

        <div className="flex justify-between">
          <span>Jumlah Anggota</span>
          <span>1</span>
        </div>

        <div className="flex justify-between">
          <span>Kepala Keluarga</span>
          <span>-</span>
        </div>

      </div>

    </div>
  );
}