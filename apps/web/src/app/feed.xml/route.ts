import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/seo';
import { API_URL, type Post } from '@/lib/public-content';

export const dynamic = 'force-dynamic';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get('lang') === 'ar' ? 'ar' : 'en';
  const base = siteConfig.url.replace(/\/$/, '');
  const prefix = lang === 'ar' ? '/ar' : '';
  const title = lang === 'ar' ? `${siteConfig.arabicName} — الكتابة` : `${siteConfig.name} Writing`;

  let items = '';
  try {
    const response = await fetch(`${API_URL}/posts?language=${lang}&status=published&limit=50`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('RSS content unavailable');
    const { data } = await response.json() as { data: Post[] };
    items = data
      .map((post) => {
        const url = `${base}${prefix}/blog/${encodeURIComponent(post.slug)}`;
        const description = post.seoDescription || post.excerpt || '';
        const date = post.publishedAt ? new Date(post.publishedAt) : null;
        const pubDate = date && !Number.isNaN(date.getTime()) ? date.toUTCString() : '';
        return `    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${escapeXml(url)}</link>\n      <guid>${escapeXml(url)}</guid>${pubDate ? `\n      <pubDate>${pubDate}</pubDate>` : ''}${description ? `\n      <description>${escapeXml(description)}</description>` : ''}\n    </item>`;
      })
      .join('\n');
  } catch {
    return new NextResponse('RSS is temporarily unavailable.', { status: 503, headers: { 'Retry-After': '60' } });
  }

  const self = `${base}/feed.xml${lang === 'ar' ? '?lang=ar' : ''}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${escapeXml(title)}</title>\n    <link>${escapeXml(`${base}${prefix}/blog`)}</link>\n    <description>${escapeXml(title)}</description>\n    <language>${lang === 'ar' ? 'ar-EG' : 'en-US'}</language>\n    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml"/>\n${items}\n  </channel>\n</rss>\n`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
