import { redirect } from 'next/navigation';

// Middleware menangani redirect ini (lebih cepat).
// Ini hanya fallback jika middleware tidak berjalan.
export default function RootPage() {
  redirect('/login');
}