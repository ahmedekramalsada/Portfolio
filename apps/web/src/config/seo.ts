import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Ahmed Ekram Alsada',
  title: 'Ahmed Ekram Alsada — DevOps Engineer in Cairo',
  description: 'DevOps Engineer in Cairo building reliable cloud platforms and AI-powered business systems. I write about Docker, Kubernetes, CI/CD, infrastructure, and the decisions behind production work.',
  arabicName: 'أحمد أكرم السادة',
  arabicDescription: 'مهندس DevOps في القاهرة. أبني منصات سحابية موثوقة وأنظمة أعمال مدعومة بالذكاء الاصطناعي، وأكتب عن Docker وKubernetes وCI/CD والبنية التحتية.',
  url: 'https://ahmedekram.site',
  ogImage: 'https://ahmedekram.site/og.png',
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
  keywords: ['DevOps Engineer', 'Docker', 'Kubernetes', 'CI/CD', 'Platform Engineering', 'Cairo', 'Egypt', 'AI systems', 'Infrastructure', 'Cloud', 'NestJS', 'Next.js', 'TypeScript', 'PostgreSQL', 'أحمد أكرم السادة', 'مهندس DevOps', 'القاهرة', 'مصر'],
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
    title: siteConfig.name,
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

export function generatePageMetadata(overrides: { title?: string; description?: string; path?: string; ogImage?: string; noIndex?: boolean; localized?: boolean } = {}): Metadata {
  const path = overrides.path || '/';
  const url = `${siteConfig.url}${path === '/' ? '' : path}`;
  const language = path === '/ar' || path.startsWith('/ar/') ? 'ar' : 'en';
  const localized = overrides.localized ?? (!path.startsWith('/blog/') && !path.startsWith('/ar/blog/'));
  const paths = localizedPaths(path);
  const title = overrides.title || siteConfig.title;
  const description = overrides.description || (language === 'ar' ? siteConfig.arabicDescription : siteConfig.description);
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
    },
    openGraph: {
      title,
      description,
      url,
      locale: language === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: language === 'ar' ? ['en_US'] : ['ar_EG'],
      images: [{ url: overrides.ogImage || siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: { title, description, images: [overrides.ogImage || siteConfig.ogImage] },
    robots: overrides.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function getJsonLdScript(json: string) { return { __html: json }; }
