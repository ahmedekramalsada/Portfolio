type SitemapPost = { slug: string; language: string; updated_at?: string | null };
type SitemapProject = { slug: string; updated_at?: string | null };
type FeedPost = { title: string; slug: string; excerpt?: string | null; published_at?: string | null; updated_at?: string | null };

export function xmlEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function isoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  // D1 CURRENT_TIMESTAMP is UTC but has no timezone suffix.
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value) ? `${value.replace(' ', 'T')}Z` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function buildSitemap(base: string, posts: SitemapPost[], projects: SitemapProject[]): string {
  const site = base.replace(/\/$/, '');
  const entries: string[] = [];
  const portrait = `${site}/ahmed-ekram-alsada.webp`;
  const portraitCaption = 'Ahmed Ekram Alsada — DevOps Engineer';
  const imageTag = (loc: string, caption = portraitCaption) => `<image:image><image:loc>${xmlEscape(loc)}</image:loc><image:caption>${xmlEscape(caption)}</image:caption><image:title>${xmlEscape('Ahmed Ekram Alsada')}</image:title></image:image>`;
  const entry = (path: string, alternates?: { en: string; ar: string }, updated?: string | null, images?: string) => {
    const date = isoDate(updated);
    const links = alternates ? [['en-US', alternates.en], ['ar-EG', alternates.ar], ['x-default', alternates.en]]
      .map(([language, url]) => `<xhtml:link rel="alternate" hreflang="${language}" href="${xmlEscape(site + url)}"/>`).join('') : '';
    entries.push(`<url><loc>${xmlEscape(site + path)}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}${links}${images || ''}</url>`);
  };
  for (const path of ['', '/about', '/blog', '/projects', '/contact']) {
    const alternates = { en: path, ar: `/ar${path}` };
    const images = path === '' || path === '/about' ? imageTag(portrait) : '';
    entry(alternates.en, alternates, undefined, images);
    entry(alternates.ar, alternates, undefined, images);
  }
  for (const post of posts) {
    if (post.language !== 'en' && post.language !== 'ar') continue;
    entry(`${post.language === 'ar' ? '/ar' : ''}/blog/${encodeURIComponent(post.slug)}`, undefined, post.updated_at);
  }
  // Match the verified public project routes in web/src/lib/project-copy.ts.
  const publicProjectSlugs = new Set(['final-project-devops', 'final-project', 'ahmed-os']);
  for (const project of projects.filter((item) => publicProjectSlugs.has(item.slug))) {
    const path = `/projects/${encodeURIComponent(project.slug)}`;
    const alternates = { en: path, ar: `/ar${path}` };
    entry(alternates.en, alternates, project.updated_at);
    entry(alternates.ar, alternates, project.updated_at);
  }
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries.join('')}</urlset>`;
}

export function buildRobots(base: string): string {
  // Authentication protects dashboard data; robots rules are not access control.
  // Login is crawlable so search engines can actually read its noindex directive.
  return `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /api/\nSitemap: ${base.replace(/\/$/, '')}/sitemap.xml\n`;
}

export function buildFeed(base: string, language: 'en' | 'ar', posts: FeedPost[]): string {
  const site = base.replace(/\/$/, '');
  const prefix = language === 'ar' ? '/ar' : '';
  const title = language === 'ar' ? 'أحمد أكرم السادة — الكتابة' : 'Ahmed Ekram Alsada Writing';
  const description = language === 'ar' ? 'مقالات عن DevOps والبنية التحتية والذكاء الاصطناعي العملي.' : 'DevOps, cloud infrastructure, and practical AI systems.';
  const self = `${site}/feed.xml${language === 'ar' ? '?lang=ar' : ''}`;
  const items = posts.map((post) => {
    const url = `${site}${prefix}/blog/${encodeURIComponent(post.slug)}`;
    const date = isoDate(post.published_at || post.updated_at);
    return `<item><title>${xmlEscape(post.title)}</title><link>${xmlEscape(url)}</link><guid isPermaLink="true">${xmlEscape(url)}</guid>${date ? `<pubDate>${new Date(date).toUTCString()}</pubDate>` : ''}${post.excerpt ? `<description>${xmlEscape(post.excerpt)}</description>` : ''}</item>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xmlEscape(title)}</title><link>${xmlEscape(`${site}${prefix}/blog`)}</link><description>${xmlEscape(description)}</description><language>${language === 'ar' ? 'ar-EG' : 'en-US'}</language><atom:link href="${xmlEscape(self)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
