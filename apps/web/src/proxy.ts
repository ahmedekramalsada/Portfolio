import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-ahmed-locale', locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|feed.xml|json-ld).*)'],
};
