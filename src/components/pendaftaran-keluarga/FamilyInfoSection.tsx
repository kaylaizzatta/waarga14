export default function FamilyInfoSection() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-lg font-semibold text-slate-900">
        Informasi Keluarga
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Masukkan informasi dasar keluarga yang akan didaftarkan.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            RT Domisili
          </label>

          <select className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none">
            <option>RT 01</option>
            <option>RT 02</option>
            <option>RT 03</option>
            <option>RT 04</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Alamat
          </label>

          <input
            type="text"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
            placeholder="Masukkan alamat lengkap"
          />
        </div>

      </div>

      <div className="mt-5">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Catatan
        </label>

        <textarea
          rows={4}
          placeholder="Opsional"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
        />

      </div>

    </div>
  );
}