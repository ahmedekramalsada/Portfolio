import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Ahmed Ekram Alsada',
  title: 'Ahmed Ekram Alsada — DevOps Engineer',
  description: 'Ahmed Ekram Alsada is a DevOps Engineer building reliable cloud platforms and AI-powered business systems. I write about Docker, Kubernetes, CI/CD, infrastructure, and the decisions behind production work.',
  arabicName: 'أحمد أكرم السادة',
  arabicDescription: 'مهندس DevOps. أبني منصات سحابية موثوقة وأنظمة أعمال مدعومة بالذكاء الاصطناعي، وأكتب عن Docker وKubernetes وCI/CD والبنية التحتية.',
  url: 'https://ahmedekram.site',
  ogImage: 'https://ahmedekram.site/og.png',
  portrait: 'https://ahmedekram.site/ahmed-ekram-alsada.webp',
  links: {
    github: 'https://github.com/ahmedekramalsada',
    linkedin: 'https://www.linkedin.com/in/ahmedekramalsada',
  },
  creator: 'Ahmed Ekram Alsada',
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: ['Ahmed Ekram Alsada', 'Ahmed Ekram', 'Ahmed Ekram Alsada DevOps', 'DevOps Engineer', 'Docker', 'Kubernetes', 'CI/CD', 'Platform Engineering', 'AI systems', 'Infrastructure', 'Cloud', 'NestJS', 'Next.js', 'TypeScript', 'PostgreSQL', 'أحمد أكرم السادة', 'مهندس DevOps'],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: { 'en-US': siteConfig.url, 'ar-EG': `${siteConfig.url}/ar`, 'x-default': siteConfig.url },
    types: { 'application/rss+xml': `${siteConfig.url}/feed.xml` },
  },
};

function localizedPaths(path: string) {
  if (path === '/ar' || path === '/ar/') return { en: '/', ar: '/ar' };
  if (path.startsWith('/ar/')) return { en: path.slice(3) || '/', ar: path };
  return { en: path || '/', ar: path === '/' ? '/ar' : `/ar${path}` };
}

export function generatePageMetadata(overrides: { title?: string; description?: string; path?: string; ogImage?: string; ogImageAlt?: string; noIndex?: boolean; localized?: boolean } = {}): Metadata {
  const path = overrides.path || '/';
  const url = `${siteConfig.url}${path === '/' ? '' : path}`;
  const language = path === '/ar' || path.startsWith('/ar/') ? 'ar' : 'en';
  const localized = overrides.localized ?? (!path.startsWith('/blog/') && !path.startsWith('/ar/blog/'));
  const paths = localizedPaths(path);
  const title = overrides.title || siteConfig.title;
  const description = overrides.description || (language === 'ar' ? siteConfig.arabicDescription : siteConfig.description);
  const ogImage = overrides.ogImage || siteConfig.ogImage;
  const ogImageAlt = overrides.ogImageAlt || title;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: localized ? {
        'en-US': `${siteConfig.url}${paths.en === '/' ? '' : paths.en}`,
        'ar-EG': `${siteConfig.url}${paths.ar === '/' ? '' : paths.ar}`,
        'x-default': `${siteConfig.url}${paths.en === '/' ? '' : paths.en}`,
      } : undefined,
      types: { 'application/rss+xml': `${siteConfig.url}/feed.xml${language === 'ar' ? '?lang=ar' : ''}` },
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title,
      description,
      url,
      locale: language === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: language === 'ar' ? ['en_US'] : ['ar_EG'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    robots: {
      index: !overrides.noIndex,
      follow: true,
      googleBot: { index: !overrides.noIndex, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export function getJsonLdScript(json: string) { return { __html: json.replace(/</g, '\\u003c') }; }

export function blogPageNumber(value?: string): number {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function generateBlogMetadata(locale: 'en' | 'ar', params: { page?: string; category?: string; q?: string }): Metadata {
  const page = blogPageNumber(params.page);
  const path = `${locale === 'ar' ? '/ar' : ''}/blog${page > 1 ? `?page=${page}` : ''}`;
  return generatePageMetadata({
    title: locale === 'ar' ? `الكتابة${page > 1 ? ` — صفحة ${page}` : ''}` : `Writing${page > 1 ? ` — Page ${page}` : ''}`,
    description: locale === 'ar' ? 'مقالات في DevOps والبنية التحتية السحابية وهندسة المنصات وأنظمة الذكاء الاصطناعي العملية من أحمد أكرم السادة.' : 'Articles on DevOps, Docker, Kubernetes, CI/CD, cloud infrastructure, platform engineering, and practical AI systems by Ahmed Ekram Alsada.',
    path,
    noIndex: page > 1 || Boolean(params.q?.trim() || (params.category && params.category !== 'all')),
  });
}
