import type { Metadata } from 'next';
import { PublicArticle } from '@/components/site/public-article';
import { getPost } from '@/lib/public-content';
import { generatePageMetadata } from '@/config/seo';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const post = await getPost(slug, 'ar'); if (!post) return generatePageMetadata({ title: 'المقال غير موجود', description: 'المقال غير متاح بالعربية.', path: `/ar/blog/${slug}` }); return generatePageMetadata({ title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt || post.title, path: `/ar/blog/${slug}`, ogImage: post.coverImage || undefined, localized: false }); }
export default async function ArabicArticlePage({ params }: Props) { const { slug } = await params; return <PublicArticle locale="ar" slug={slug} />; }
