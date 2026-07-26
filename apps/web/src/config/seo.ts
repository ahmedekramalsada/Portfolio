export const siteConfig = {
  name: 'Ahmed Ekram Al Sada',
  title: 'Ahmed Ekram Al Sada — DevOps Engineer & Software Architect',
  description: 'DevOps Engineer and Software Architect at SmartSigma. Building production-grade systems with Docker, Kubernetes, CI/CD, cloud infrastructure, and AI-powered platform engineering.',
  arabicName: 'احمد اكرام السادة',
  arabicDescription: 'مهندس DevOps ومهندس برمجيات في SmartSigma. خبرة في Docker و Kubernetes و CI/CD والبنية التحتية السحابية.',
  url: 'https://ahmedekram.site',
  ogImage: 'https://ahmedekram.site/og.png',
  links: {
    github: 'https://github.com/ahmedekramalsada',
    linkedin: 'https://linkedin.com/in/ahmedekramalsada',
  },
  creator: 'Ahmed Ekram Al Sada',
};

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'DevOps Engineer', 'Software Architect', 'Docker', 'Kubernetes', 'CI/CD',
    'Platform Engineering', 'SmartSigma', 'Cairo', 'Egypt', 'AI Engineering',
    'Infrastructure', 'Cloud', 'NestJS', 'Next.js', 'TypeScript', 'PostgreSQL',
  ],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': `${siteConfig.url}/feed.xml`,
    },
  },
};

export function generatePageMetadata(overrides: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
} = {}) {
  const url = overrides.path ? `${siteConfig.url}${overrides.path}` : siteConfig.url;
  return {
    title: overrides.title || siteConfig.title,
    description: overrides.description || siteConfig.description,
    alternates: { canonical: url },
    openGraph: {
      title: overrides.title || siteConfig.title,
      description: overrides.description || siteConfig.description,
      url,
      images: overrides.ogImage ? [{ url: overrides.ogImage }] : undefined,
    },
    twitter: {
      title: overrides.title || siteConfig.title,
      description: overrides.description || siteConfig.description,
    },
    robots: overrides.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function getJsonLdScript(json: string) {
  return {
    __html: json,
  };
}
