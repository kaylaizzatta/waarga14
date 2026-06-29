import { ComingSoon } from '@/components/ui/ComingSoon';

export default function StatistikEkonomiPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Statistik Ekonomi</h1>
        <p className="text-sm text-slate-500 mt-1">
          Analisis pekerjaan dan kondisi ekonomi warga
        </p>
      </div>
      <ComingSoon />
    </div>
  );
}
