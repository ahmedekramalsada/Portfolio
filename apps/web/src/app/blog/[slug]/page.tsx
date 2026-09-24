import type { Metadata } from 'next';
import { PublicArticle } from '@/components/site/public-article';
import { getPost } from '@/lib/public-content';
import { generatePageMetadata } from '@/config/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug, 'en');
  if (!post) return generatePageMetadata({ title: 'Article not found', description: 'The article could not be found.', path: `/blog/${slug}` });
  return generatePageMetadata({ title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt || post.title, path: `/blog/${slug}`, ogImage: post.coverImage || undefined, localized: false });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  return <PublicArticle locale="en" slug={slug} />;
}
