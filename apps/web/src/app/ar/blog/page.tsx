import type { Metadata } from 'next';
import { PublicBlog } from '@/components/site/public-blog';
import { generateBlogMetadata } from '@/config/seo';

type Props = { searchParams: Promise<{ page?: string; category?: string; q?: string }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> { return generateBlogMetadata('ar', await searchParams); }
export default async function ArabicBlogPage({ searchParams }: Props) { const params = await searchParams; return <PublicBlog locale="ar" searchParams={params} />; }
