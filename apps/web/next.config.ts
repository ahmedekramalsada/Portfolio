import type { NextConfig } from 'next';

const seoApiBase = (process.env.SEO_API_URL || process.env.API_URL || (
  process.env.NODE_ENV === 'production'
    ? 'https://ahmed-os-api.aekram8.workers.dev'
    : 'http://localhost:4000'
)).replace(/\/api\/v1\/?$/, '');

const nextConfig: NextConfig = {
  // Hide the development indicator: it floats over page content and gets
  // mistaken for part of the design.
  devIndicators: false,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudflare.com' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'https', hostname: '**.b-cdn.net' },
      { protocol: 'https', hostname: 'media.ahmedekram.site' },
    ],
  },
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: `${seoApiBase}/sitemap.xml` },
      { source: '/robots.txt', destination: `${seoApiBase}/robots.txt` },
      { source: '/feed.xml', destination: `${seoApiBase}/feed.xml` },
      { source: '/json-ld/person', destination: `${seoApiBase}/json-ld/person` },
      { source: '/json-ld/website', destination: `${seoApiBase}/json-ld/website` },
    ];
  },
  async headers() {
    return [
      {
        source: '/:all*(webp|avif|png|jpg|jpeg|svg|ico|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
