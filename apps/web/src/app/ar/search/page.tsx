import type { Metadata } from 'next';
import { PublicSearch } from '@/components/site/public-search';
import { generatePageMetadata } from '@/config/seo';

type Props = { searchParams: Promise<{ q?: string }> };
export const metadata: Metadata = generatePageMetadata({ title: 'بحث', description: 'ابحث في مقالات أحمد أكرم السادة وأعماله المختارة.', path: '/ar/search', noIndex: true });

export default async function ArabicSearchPage({ searchParams }: Props) {
  const params = await searchParams;
  return <PublicSearch locale="ar" initialQuery={params.q || ''} />;
}
