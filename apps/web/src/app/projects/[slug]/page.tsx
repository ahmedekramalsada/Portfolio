import type { Metadata } from 'next';
import { PublicProject } from '@/components/site/public-project';
import { getProject } from '@/lib/public-content';
import { projectCopy } from '@/lib/project-copy';
import { generatePageMetadata } from '@/config/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const details = projectCopy('en', slug);
  const project = await getProject(slug);
  if (!details || !project) return generatePageMetadata({ title: 'Project not found', description: 'The project could not be found.', path: `/projects/${slug}` });
  return generatePageMetadata({ title: details.title, description: details.result, path: `/projects/${slug}`, ogImage: project.coverImage || undefined, localized: true });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  return <PublicProject locale="en" slug={slug} />;
}
