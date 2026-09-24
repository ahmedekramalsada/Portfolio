import type { Metadata } from 'next';
import { PublicAbout } from '@/components/site/public-about';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'About',
  description: 'Learn about Ahmed Ekram Alsada, a DevOps Engineer in Cairo working on reliable cloud platforms and practical AI systems.',
  path: '/about',
});

export default function AboutPage() {
  return <PublicAbout locale="en" />;
}
