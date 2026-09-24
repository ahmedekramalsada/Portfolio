import type { Metadata } from 'next';
import { PublicProject } from '@/components/site/public-project';
import { getProject } from '@/lib/public-content';
import { projectCopy } from '@/lib/project-copy';
import { generatePageMetadata } from '@/config/seo';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const details = projectCopy('ar', slug); const project = await getProject(slug); if (!details || !project) return generatePageMetadata({ title: 'المشروع غير موجود', description: 'المشروع غير متاح بالعربية.', path: `/ar/projects/${slug}` }); return generatePageMetadata({ title: details.title, description: details.result, path: `/ar/projects/${slug}`, ogImage: project.coverImage || undefined, localized: true }); }
export default async function ArabicProjectPage({ params }: Props) { const { slug } = await params; return <PublicProject locale="ar" slug={slug} />; }
