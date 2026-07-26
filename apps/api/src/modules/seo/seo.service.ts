import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);

  constructor(private prisma: PrismaService) {}

  // === SITEMAP XML ===
  async getSitemap(): Promise<string> {
    const baseUrl = 'https://ahmedekram.site';
    const urls: string[] = [];

    // Static pages
    const staticPages = ['', '/about', '/resume', '/blog', '/projects', '/contact', '/ai', '/search'];
    for (const page of staticPages) {
      urls.push(this.sitemapEntry(`${baseUrl}${page}`, this.getPriority(page), this.getChangeFreq(page)));
    }

    // Blog posts
    const posts = await this.prisma.blogPost.findMany({
      where: { status: 'published', deletedAt: null },
      select: { slug: true, updatedAt: true, publishedAt: true },
    });
    for (const post of posts) {
      urls.push(this.sitemapEntry(
        `${baseUrl}/blog/${post.slug}`,
        '0.7',
        'weekly',
        (post.updatedAt || post.publishedAt).toISOString(),
      ));
    }

    // Projects
    const projects = await this.prisma.project.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
    });
    for (const project of projects) {
      urls.push(this.sitemapEntry(
        `${baseUrl}/projects/${project.slug}`,
        '0.6',
        'monthly',
        project.updatedAt?.toISOString(),
      ));
    }

    // Pages
    const pages = await this.prisma.page.findMany({
      where: { published: true, deletedAt: null },
      select: { slug: true, updatedAt: true },
    });
    for (const page of pages) {
      urls.push(this.sitemapEntry(
        `${baseUrl}/pages/${page.slug}`,
        '0.5',
        'monthly',
        page.updatedAt?.toISOString(),
      ));
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('')}
</urlset>`;
  }

  private sitemapEntry(loc: string, priority: string, changefreq: string, lastmod?: string): string {
    return `  <url>
    <loc>${this.escapeXml(loc)}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <xhtml:link rel="alternate" hreflang="en" href="${this.escapeXml(loc)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${this.escapeXml(loc)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${this.escapeXml(loc)}"/>
  </url>\n`;
  }

  private getPriority(page: string): string {
    if (page === '' || page === '/about') return '1.0';
    if (page === '/blog') return '0.9';
    if (page === '/projects') return '0.9';
    if (page === '/resume') return '0.8';
    return '0.5';
  }

  private getChangeFreq(page: string): string {
    if (page === '') return 'weekly';
    if (page === '/blog') return 'daily';
    return 'monthly';
  }

  // === ROBOTS.TXT ===
  async getRobots(): Promise<string> {
    return `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /login
Disallow: /api/
Disallow: /_next/

Sitemap: https://ahmedekram.site/sitemap.xml

# Allow crawlers to index content
User-agent: Googlebot
Allow: /
Disallow: /dashboard
Disallow: /login

User-agent: Bingbot
Allow: /
Disallow: /dashboard
Disallow: /login

User-agent: GPTBot
Disallow: /
`;
  }

  // === RSS FEED ===
  async getRss(): Promise<string> {
    const baseUrl = 'https://ahmedekram.site';
    const posts = await this.prisma.blogPost.findMany({
      where: { status: 'published', deletedAt: null },
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: { category: true, tags: { include: { tag: true } } },
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>Ahmed Ekram Al Sada</title>
  <link>${baseUrl}</link>
  <description>DevOps Engineer &amp; Software Architect. Articles on Docker, Kubernetes, CI/CD, AI, and platform engineering.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${posts.map((post) => `  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${baseUrl}/blog/${post.slug}</link>
    <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
    <pubDate>${(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
    <dc:creator>Ahmed Ekram Al Sada</dc:creator>
    ${post.category ? `<category>${post.category.name}</category>` : ''}
    ${post.excerpt ? `<description><![CDATA[${post.excerpt}]]></description>` : ''}
    ${post.content ? `<content:encoded><![CDATA[${post.content.slice(0, 5000)}]]></content:encoded>` : ''}
  </item>`).join('\n')}
</channel>
</rss>`;
  }

  // === JSON-LD STRUCTURED DATA ===
  async getPersonJsonLd(): Promise<string> {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ahmed Ekram Al Sada',
      alternateName: 'احمد اكرام السادة',
      url: 'https://ahmedekram.site',
      image: 'https://media.ahmedekram.site/media/1785021278987-ahmed_ekram_alsada_profile_photo.webp',
      jobTitle: 'DevOps Engineer',
      worksFor: { '@type': 'Organization', name: 'SmartSigma' },
      sameAs: [
        'https://github.com/ahmedekramalsada',
        'https://linkedin.com/in/ahmedekramalsada',
        'https://ahmedekram.site',
      ],
      knowsAbout: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'AI Engineering', 'Platform Engineering'],
      description: 'DevOps Engineer and Software Architect building production-grade systems.',
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
      name: 'Ahmed Ekram Al Sada',
      url: 'https://ahmedekram.site',
      description: 'Personal developer platform featuring projects, blog, and AI assistant.',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://ahmedekram.site/search?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    });
  }

  async getBlogPostJsonLd(slug: string): Promise<string | null> {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: 'published', deletedAt: null },
      include: { category: true, tags: { include: { tag: true } } },
    });
    if (!post) return null;

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || post.title,
      url: `https://ahmedekram.site/blog/${post.slug}`,
      datePublished: post.publishedAt?.toISOString(),
      dateModified: post.updatedAt?.toISOString(),
      author: { '@type': 'Person', name: 'Ahmed Ekram Al Sada' },
      keywords: post.tags?.map((t: any) => t.tag.name).join(', ') || undefined,
    });
  }

  async getProjectJsonLd(slug: string): Promise<string | null> {
    const project = await this.prisma.project.findFirst({
      where: { slug, deletedAt: null },
      include: { technologies: { include: { technology: true } } },
    });
    if (!project) return null;

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Project',
      name: project.title,
      description: project.description,
      url: `https://ahmedekram.site/projects/${project.slug}`,
      status: project.status === 'completed' ? 'Completed' : 'Active',
    });
  }

  async getBreadcrumbJsonLd(items: { name: string; url: string }[]): Promise<string> {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: `https://ahmedekram.site${item.url}`,
      })),
    });
  }

  private escapeXml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
