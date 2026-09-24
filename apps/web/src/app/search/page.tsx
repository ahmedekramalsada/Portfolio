import type { Metadata } from 'next';
import { PublicSearch } from '@/components/site/public-search';
import { generatePageMetadata } from '@/config/seo';

type Props = { searchParams: Promise<{ q?: string }> };
export const metadata: Metadata = generatePageMetadata({ title: 'Search', description: 'Search Ahmed Ekram Alsada’s articles and selected work.', path: '/search', noIndex: true });

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  return <PublicSearch locale="en" initialQuery={params.q || ''} />;
}
