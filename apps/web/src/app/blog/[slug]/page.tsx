import type { Metadata } from 'next';
import { PublicArticle } from '@/components/site/public-article';
import { getPost } from '@/lib/public-content';
import { generatePageMetadata } from '@/config/seo';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug, 'en');
  if (!post) notFound();
  const metadata = generatePageMetadata({ title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt || post.title, path: `/blog/${encodeURIComponent(slug)}`, ogImage: post.coverImage || undefined, localized: false });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article', publishedTime: post.publishedAt || undefined, modifiedTime: post.updatedAt || undefined, authors: [post.author?.name || 'Ahmed Ekram Alsada'] } };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  return <PublicArticle locale="en" slug={slug} />;
}
