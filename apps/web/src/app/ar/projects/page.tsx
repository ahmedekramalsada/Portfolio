import type { Metadata } from 'next';
import { PublicProjects } from '@/components/site/public-projects';
import { generatePageMetadata } from '@/config/seo';
export const metadata: Metadata = generatePageMetadata({ title: 'الأعمال', description: 'أعمال مختارة في DevOps والبنية التحتية السحابية وهندسة المنصات من أحمد أكرم السادة.', path: '/ar/projects' });
export default function ArabicProjectsPage() { return <PublicProjects locale="ar" />; }
