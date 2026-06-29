import { ComingSoon } from '@/components/ui/ComingSoon';

export default function PengaturanPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Pengaturan</h1>
        <p className="text-sm text-slate-400 mt-1">
          Konfigurasi sistem dan manajemen akun pengguna
        </p>
      </div>
      <ComingSoon
        label="Pengaturan sistem"
        description="Manajemen akun dan konfigurasi akan tersedia di tahap berikutnya."
      />
    </div>
  );
}