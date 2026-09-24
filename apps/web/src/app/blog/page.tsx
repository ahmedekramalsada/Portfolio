import type { Metadata } from 'next';
import { PublicBlog } from '@/components/site/public-blog';
import { generatePageMetadata } from '@/config/seo';

type Props = { searchParams: Promise<{ page?: string; category?: string; q?: string }> };

export const metadata: Metadata = generatePageMetadata({
  title: 'Writing',
  description: 'Articles on DevOps, Docker, Kubernetes, CI/CD, cloud infrastructure, platform engineering, and practical AI systems by Ahmed Ekram Alsada.',
  path: '/blog',
});

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  return <PublicBlog locale="en" searchParams={params} />;
}
