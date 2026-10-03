import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import '@/styles/globals.css';
import { Providers } from '@/providers/providers';
import { LocaleDocumentSync } from '@/providers/locale-document-sync';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { DeployLoader } from '@/components/site/deploy-loader';
import { defaultMetadata, getJsonLdScript, siteConfig } from '@/config/seo';
import Script from 'next/script';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get('x-ahmed-locale') === 'ar' ? 'ar' : 'en';
  const pathname = requestHeaders.get('x-ahmed-pathname') || '/';
  const bareChrome = pathname === '/login' || pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    alternateName: siteConfig.arabicName,
    url: siteConfig.url,
    jobTitle: 'DevOps Engineer',
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
    knowsAbout: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud infrastructure', 'AI systems'],
  };
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ['en-US', 'ar-EG'],
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteConfig.url}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang={locale === 'ar' ? 'ar-EG' : 'en-US'} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {(pathname === '/' || pathname === '/ar') && <link rel="preload" as="image" href="/profile-152.webp" imageSrcSet="/profile-152.webp 1x, /profile-304.webp 2x" fetchPriority="high" />}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Script id="person-jsonld" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={getJsonLdScript(JSON.stringify(personJsonLd))} />
        <Script id="website-jsonld" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={getJsonLdScript(JSON.stringify(websiteJsonLd))} />
        <link rel="alternate" type="application/rss+xml" title={`${siteConfig.name} Writing`} href="/feed.xml" />
        <link rel="alternate" type="application/rss+xml" title={`${siteConfig.name} — الكتابة`} href="/feed.xml?lang=ar" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js-ready');" }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers><DeployLoader /><LocaleDocumentSync />{bareChrome ? (<main id="main-content" className="min-h-screen">{children}</main>) : (<div className="flex min-h-screen flex-col"><a href="#main-content" className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 rounded-lg bg-foreground px-4 py-3 text-background">{locale === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}</a><Navbar /><main id="main-content" className="flex-1" tabIndex={-1}>{children}</main><Footer /></div>)}</Providers>
      </body>
    </html>
  );
}
