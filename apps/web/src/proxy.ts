import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SERVER_API_URL } from '@/lib/api-config';
import { siteConfig } from '@/config/seo';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if ((request.nextUrl.hostname === 'ahmedekram.site' && request.nextUrl.protocol === 'http:') || request.nextUrl.hostname === 'web.aekram8.workers.dev') {
    return NextResponse.redirect(new URL(`${pathname}${request.nextUrl.search}`, siteConfig.url), 308);
  }
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
  requestHeaders.set('x-ahmed-pathname', pathname);
  const article = pathname.match(/^\/(?:ar\/)?blog\/([^/]+)\/?$/);
  if (article && (request.method === 'GET' || request.method === 'HEAD')) {
    // Validate before streaming the layout. notFound() in an async child alone
    // can send a 200 status before it discovers that the article is absent.
    try {
      const response = await fetch(`${SERVER_API_URL}/posts/${article[1]}`, { signal: AbortSignal.timeout(8000) });
      if (response.status === 404 || (response.ok && (await response.json()).language !== locale)) {
        return NextResponse.rewrite(new URL('/article-not-found', request.url), { request: { headers: requestHeaders } });
      }
      if (!response.ok) return new NextResponse('Content is temporarily unavailable.', { status: 503, headers: { 'Retry-After': '60' } });
    } catch {
      return new NextResponse('Content is temporarily unavailable.', { status: 503, headers: { 'Retry-After': '60' } });
    }
  }
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (pathname === '/login' || pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
    response.headers.set('X-Robots-Tag', 'noindex');
  }
  return response;
}

export const config = {
  matcher: ['/:path*'],
};
