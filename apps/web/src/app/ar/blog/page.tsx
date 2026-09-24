import type { Metadata } from 'next';
import { PublicBlog } from '@/components/site/public-blog';
import { generatePageMetadata } from '@/config/seo';

type Props = { searchParams: Promise<{ page?: string; category?: string; q?: string }> };
export const metadata: Metadata = generatePageMetadata({ title: 'الكتابة', description: 'مقالات في DevOps والبنية التحتية السحابية وهندسة المنصات وأنظمة الذكاء الاصطناعي العملية من أحمد أكرم السادة.', path: '/ar/blog' });
export default async function ArabicBlogPage({ searchParams }: Props) { const params = await searchParams; return <PublicBlog locale="ar" searchParams={params} />; }
