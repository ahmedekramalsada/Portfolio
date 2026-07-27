import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
      { source: '/sitemap.xml', destination: `${process.env.API_URL || 'http://localhost:4000'}/sitemap.xml` },
      { source: '/robots.txt', destination: `${process.env.API_URL || 'http://localhost:4000'}/robots.txt` },
      { source: '/feed.xml', destination: `${process.env.API_URL || 'http://localhost:4000'}/feed.xml` },
      { source: '/json-ld/:path*', destination: `${process.env.API_URL || 'http://localhost:4000'}/json-ld/:path*` },
    ];
  },
};

export default nextConfig;
