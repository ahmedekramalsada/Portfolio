import type { Metadata } from 'next';
import { PublicProjects } from '@/components/site/public-projects';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Work',
  description: 'Selected DevOps, cloud infrastructure, platform engineering, and software work by Ahmed Ekram Alsada.',
  path: '/projects',
});

export default function ProjectsPage() {
  return <PublicProjects locale="en" />;
}
