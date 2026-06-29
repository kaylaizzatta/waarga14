import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/constants';

/**
 * Validasi session dari cookie request.
 *
 * Middleware berjalan di Edge Runtime — tidak bisa menggunakan
 * cookies() dari 'next/headers'. Gunakan request.cookies secara langsung.
 */
function hasValidSession(request: NextRequest): boolean {
  const raw = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw);
    return (
      parsed !== null &&
      typeof parsed === 'object' &&
      typeof parsed.id === 'number' &&
      typeof parsed.username === 'string' &&
      (parsed.role === 'RT' || parsed.role === 'RW')
    );
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasValidSession(request);

  // Root (/) → redirect sesuai status autentikasi
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(authenticated ? '/dashboard' : '/login', request.url)
    );
  }

  // /dashboard/* → wajib login
  if (pathname.startsWith('/dashboard')) {
    if (!authenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname); // Simpan tujuan asal
      return NextResponse.redirect(url);
    }
  }

  // /login → sudah login? redirect ke dashboard
  if (pathname.startsWith('/login') && authenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Jalankan middleware di semua path kecuali aset statis
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};