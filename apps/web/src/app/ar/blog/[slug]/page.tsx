import type { Metadata } from 'next';
import { PublicArticle } from '@/components/site/public-article';
import { getPost } from '@/lib/public-content';
import { generatePageMetadata } from '@/config/seo';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug, 'ar');
  if (!post) notFound();
  const metadata = generatePageMetadata({ title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt || post.title, path: `/ar/blog/${encodeURIComponent(slug)}`, ogImage: post.coverImage || undefined, localized: false });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article', publishedTime: post.publishedAt || undefined, modifiedTime: post.updatedAt || undefined, authors: [post.author?.name || 'أحمد أكرم السادة'] } };
}
export default async function ArabicArticlePage({ params }: Props) { const { slug } = await params; return <PublicArticle locale="ar" slug={slug} />; }
