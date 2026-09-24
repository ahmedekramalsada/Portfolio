import type { Metadata } from 'next';
import { PublicHome } from '@/components/site/public-home';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'DevOps Engineer in Cairo',
  description: 'DevOps Engineer in Cairo building reliable cloud platforms and AI-powered business systems.',
});

export default function HomePage() {
  return <PublicHome locale="en" />;
}
