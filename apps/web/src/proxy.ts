import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    const token = request.cookies.get('ahmed_access_token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-ahmed-locale', locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|feed.xml|json-ld).*)'],
};
