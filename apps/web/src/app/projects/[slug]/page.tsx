const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleContent } from '@/components/site/article-content';

type Props = { params: Promise<{ slug: string }> };

const STATUS: Record<string, { label: string; className: string }> = {
  completed: { label: 'Shipped', className: 's-ok' },
  in_progress: { label: 'In progress', className: 's-live' },
  planning: { label: 'Planned', className: '' },
};

function techName(tech: unknown): string {
  if (typeof tech === 'string') return tech;
  if (tech && typeof tech === 'object' && 'name' in tech) return String((tech as { name: unknown }).name);
  return '';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/projects/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const project = await res.json();
    return {
      title: `${project.title} — Projects`,
      description: project.description || project.title,
      openGraph: { title: project.title, description: project.description || project.title, images: project.coverImage ? [{ url: project.coverImage }] : [] },
    };
  } catch { return {}; }
}

async function getProject(slug: string) {
  try {
    const res = await fetch(`${API_URL}/projects/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return (
      <div className="page text-center">
        <p className="label">404</p>
        <h1 className="h1 mt-4">Project not found</h1>
        <Link href="/projects" className="btn-ghost mt-8">← Back to projects</Link>
      </div>
    );
  }

  const status = STATUS[project.status || ''] || { label: project.status?.replace('_', ' ') || 'Ongoing', className: '' };
  const techs = ((project.technologies || []) as unknown[]).map(techName).filter(Boolean);
  const meta: [string, string][] = [];
  if (project.role) meta.push(['Role', project.role]);
  if (project.difficulty) meta.push(['Difficulty', project.difficulty]);
  if (project.startDate) meta.push(['Started', new Date(project.startDate).toLocaleDateString('en-GB')]);
  if (project.endDate) meta.push(['Completed', new Date(project.endDate).toLocaleDateString('en-GB')]);

  return (
    <div className="page">
      <Link href="/projects" className="mb-4 inline-flex min-h-[36px] items-center gap-2 font-mono text-[11.5px] uppercase tracking-[.09em] text-dim transition hover:text-warm">
        ← Back to projects
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`status ${status.className}`}>{status.label}</span>
          {project.featured && <span className="status s-warm">Featured</span>}
        </div>
        <h1 className="h1 mt-6 max-w-[28ch]">{project.title}</h1>

        {techs.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {techs.map((tech) => (
              <span key={tech} className="rounded-md border border-line bg-muted px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                {tech}
              </span>
            ))}
          </div>
        )}

        {(project.githubUrl || project.demoUrl) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">GitHub →</a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Live demo →</a>
            )}
          </div>
        )}
      </header>

      {project.coverImage && project.coverImage !== '' && (
        <img src={project.coverImage} alt={project.title} className="mb-10 max-h-96 w-full rounded-2xl border border-line object-cover" />
      )}

      {project.description && <p className="lede mb-10 max-w-[70ch] text-[17px]">{project.description}</p>}

      {project.content && (
        <div className="article rule pt-10">
          <ArticleContent content={project.content} />
        </div>
      )}

      {meta.length > 0 && (
        <div className="panel mt-14 divide-y divide-line">
          {meta.map(([term, value]) => (
            <div key={term} className="flex items-center justify-between gap-4 px-6 py-4">
              <span className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">{term}</span>
              <span className="text-[14.5px] text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
