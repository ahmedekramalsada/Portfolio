import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/seo';
import { getPosts } from '@/lib/public-content';

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
    const { data } = await getPosts({ locale: lang, limit: 50 });
    items = data
      .map((post) => {
        const url = `${base}${prefix}/blog/${post.slug}`;
        const description = post.seoDescription || post.excerpt || '';
        const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : '';
        return `    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${escapeXml(url)}</link>\n      <guid>${escapeXml(url)}</guid>${pubDate ? `\n      <pubDate>${pubDate}</pubDate>` : ''}${description ? `\n      <description>${escapeXml(description)}</description>` : ''}\n    </item>`;
      })
      .join('\n');
  } catch {
    items = '';
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(title)}</title>\n    <link>${escapeXml(`${base}${prefix}/blog`)}</link>\n    <description>${escapeXml(title)}</description>\n${items}\n  </channel>\n</rss>\n`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
