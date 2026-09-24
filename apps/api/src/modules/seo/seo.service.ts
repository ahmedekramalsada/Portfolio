import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const PUBLIC_PROJECT_SLUGS = new Set(['final-project-devops', 'final-project', 'ahmed-os']);
const LOCALIZED_PAGES: Array<[string, string]> = [
  ['', '/ar'],
  ['/about', '/ar/about'],
  ['/blog', '/ar/blog'],
  ['/projects', '/ar/projects'],
  ['/contact', '/ar/contact'],
];

@Injectable()
export class SeoService {
  constructor(private prisma: PrismaService) {}

  private readonly baseUrl = 'https://ahmedekram.site';
  private readonly siteName = 'Ahmed Ekram Alsada';
  private readonly description = 'DevOps Engineer in Cairo building reliable cloud platforms and AI-powered business systems.';
  private readonly arabicDescription = 'مهندس DevOps في القاهرة. أبني منصات سحابية موثوقة وأنظمة أعمال مدعومة بالذكاء الاصطناعي.';

  async getSitemap(): Promise<string> {
    const urls: string[] = [];
    for (const [path, alternate] of LOCALIZED_PAGES) {
      urls.push(this.sitemapEntry(`${this.baseUrl}${path}`, this.getPriority(path), this.getChangeFreq(path), path, undefined, alternate));
      urls.push(this.sitemapEntry(`${this.baseUrl}${alternate}`, this.getPriority(path), this.getChangeFreq(path), alternate, undefined, path));
    }

    const posts = await this.prisma.blogPost.findMany({
      where: { status: 'published', deletedAt: null },
      select: { slug: true, language: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
    for (const post of posts) {
      const path = this.postPath(post.slug, post.language);
      // Post slugs are unique in the current schema, so do not invent an
      // alternate language URL when no translated record exists.
      urls.push(this.sitemapEntry(`${this.baseUrl}${path}`, '0.7', 'weekly', path, (post.updatedAt || post.publishedAt)?.toISOString()));
    }

    const projects = await this.prisma.project.findMany({
      where: { deletedAt: null, slug: { in: [...PUBLIC_PROJECT_SLUGS] } },
      select: { slug: true, updatedAt: true },
    });
    for (const project of projects) {
      const path = `/projects/${project.slug}`;
      const alternate = `/ar${path}`;
      urls.push(this.sitemapEntry(`${this.baseUrl}${path}`, '0.6', 'monthly', path, project.updatedAt?.toISOString(), alternate));
      urls.push(this.sitemapEntry(`${this.baseUrl}${alternate}`, '0.6', 'monthly', alternate, project.updatedAt?.toISOString(), path));
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('')}
</urlset>`;
  }

  async getRobots(): Promise<string> {
    const privateRules = `Disallow: /dashboard
Disallow: /login
Disallow: /api/`;
    return `User-agent: *
Allow: /
${privateRules}

Sitemap: ${this.baseUrl}/sitemap.xml

# Public content is intentionally available to search and AI crawlers.
User-agent: Googlebot
Allow: /
${privateRules}

User-agent: Bingbot
Allow: /
${privateRules}

User-agent: GPTBot
Allow: /
${privateRules}

User-agent: ClaudeBot
Allow: /
${privateRules}

User-agent: PerplexityBot
Allow: /
${privateRules}

User-agent: Google-Extended
Allow: /
${privateRules}
`;
  }

  async getRss(locale: 'en' | 'ar' = 'en'): Promise<string> {
    const ar = locale === 'ar';
    const posts = await this.prisma.blogPost.findMany({
      where: { status: 'published', deletedAt: null, language: locale },
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: { category: true, tags: { include: { tag: true } } },
    });
    const root = `${this.baseUrl}${ar ? '/ar' : ''}`;
    const language = ar ? 'ar-EG' : 'en-US';
    const description = ar ? this.arabicDescription : this.description;
    const self = `${this.baseUrl}/feed.xml${ar ? '?lang=ar' : ''}`;
    const items = posts.map((post) => {
      const path = this.postPath(post.slug, post.language);
      const url = `${this.baseUrl}${path}`;
      return `  <item>
    <title>${this.cdata(post.title)}</title>
    <link>${this.escapeXml(url)}</link>
    <guid isPermaLink="true">${this.escapeXml(url)}</guid>
    <pubDate>${(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
    <dc:creator>${this.cdata(this.siteName)}</dc:creator>
    ${post.category ? `<category>${this.cdata(post.category.name)}</category>` : ''}
    ${post.excerpt ? `<description>${this.cdata(post.excerpt)}</description>` : ''}
    ${post.content ? `<content:encoded>${this.cdata(post.content.slice(0, 5000))}</content:encoded>` : ''}
  </item>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>${this.cdata(`${this.siteName} — ${ar ? 'الكتابة' : 'Writing'}`)}</title>
  <link>${this.escapeXml(root || this.baseUrl)}</link>
  <description>${this.cdata(description)}</description>
  <language>${language}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${self}" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;
  }

  async getPersonJsonLd(): Promise<string> {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: this.siteName,
      alternateName: 'أحمد أكرم السادة',
      url: this.baseUrl,
      image: 'https://media.ahmedekram.site/media/1785021278987-ahmed_ekram_alsada_profile_photo.webp',
      jobTitle: 'DevOps Engineer',
      sameAs: ['https://github.com/ahmedekramalsada', 'https://www.linkedin.com/in/ahmedekramalsada'],
      knowsAbout: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'AI systems', 'Platform Engineering'],
      description: this.description,
      knowsLanguage: [
        { '@type': 'Language', name: 'Arabic', alternateName: 'العربية' },
        { '@type': 'Language', name: 'English' },
      ],
      address: { '@type': 'PostalAddress', addressLocality: 'Cairo', addressCountry: 'EG' },
    });
  }

  async getWebsiteJsonLd(): Promise<string> {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.baseUrl,
      description: this.description,
      inLanguage: ['en-US', 'ar-EG'],
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${this.baseUrl}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    });
  }

  async getBlogPostJsonLd(slug: string): Promise<string | null> {
    const post = await this.prisma.blogPost.findFirst({ where: { slug, status: 'published', deletedAt: null }, include: { category: true, tags: { include: { tag: true } } } });
    if (!post) return null;
    const path = this.postPath(post.slug, post.language);
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || post.title,
      url: `${this.baseUrl}${path}`,
      inLanguage: post.language === 'ar' ? 'ar-EG' : 'en-US',
      datePublished: post.publishedAt?.toISOString(),
      dateModified: post.updatedAt?.toISOString(),
      author: { '@type': 'Person', name: this.siteName, url: this.baseUrl },
      keywords: post.tags?.map((item) => item.tag.name).join(', ') || undefined,
    });
  }

  async getProjectJsonLd(slug: string): Promise<string | null> {
    if (!PUBLIC_PROJECT_SLUGS.has(slug)) return null;
    const project = await this.prisma.project.findFirst({ where: { slug, deletedAt: null }, include: { technologies: { include: { technology: true } } } });
    if (!project) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Project',
      name: project.title,
      description: project.description,
      url: `${this.baseUrl}/projects/${project.slug}`,
      status: project.status === 'completed' ? 'Completed' : 'Active',
    });
  }

  async getBreadcrumbJsonLd(items: { name: string; url: string }[]): Promise<string> {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${this.baseUrl}${item.url}` })),
    });
  }

  private postPath(slug: string, language: string | null | undefined) {
    return language === 'ar' ? `/ar/blog/${slug}` : `/blog/${slug}`;
  }

  private sitemapEntry(loc: string, priority: string, changefreq: string, path: string, lastmod?: string, alternatePath?: string): string {
    const alternates = alternatePath !== undefined
      ? `\n${this.alternateLink('en-US', path === '/ar' || path.startsWith('/ar/') ? alternatePath : path)}\n${this.alternateLink('ar-EG', path === '/ar' || path.startsWith('/ar/') ? path : alternatePath)}\n${this.alternateLink('x-default', path === '/ar' || path.startsWith('/ar/') ? alternatePath : path)}`
      : '';
    return `  <url>
    <loc>${this.escapeXml(loc)}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>${lastmod ? `\n    <lastmod>${this.escapeXml(lastmod)}</lastmod>` : ''}${alternates}
  </url>\n`;
  }

  private alternateLink(language: string, path: string): string {
    return `    <xhtml:link rel="alternate" hreflang="${language}" href="${this.escapeXml(`${this.baseUrl}${path === '/' ? '' : path}`)}"/>`;
  }

  private getPriority(page: string): string {
    if (page === '' || page === '/about' || page === '/ar/about') return '1.0';
    if (page === '/blog' || page === '/ar/blog' || page === '/projects' || page === '/ar/projects') return '0.9';
    return '0.5';
  }

  private getChangeFreq(page: string): string {
    if (page === '') return 'weekly';
    if (page === '/blog' || page === '/ar/blog') return 'daily';
    return 'monthly';
  }

  private cdata(text: string): string {
    return `<![CDATA[${text.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
  }

  private escapeXml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
