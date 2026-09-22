const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/page-header';
import { TiltCard } from '@/components/site/tilt-card';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'DevOps and software development projects by Ahmed Ekram Al Sada. Docker, Kubernetes, CI/CD, cloud infrastructure, and platform engineering.',
  openGraph: { title: 'Projects — Ahmed Ekram Al Sada', description: 'DevOps projects by Ahmed Ekram Al Sada.' },
};

type Project = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status?: string | null;
  featured?: boolean;
  coverImage?: string | null;
  technologies?: unknown[] | null;
  role?: string | null;
};

const STATUS: Record<string, { label: string; className: string }> = {
  completed: { label: 'Shipped', className: 's-ok' },
  in_progress: { label: 'In progress', className: 's-live' },
  planning: { label: 'Planned', className: '' },
};

/** Technologies may arrive as plain names or as objects; render both safely. */
function techName(tech: unknown): string {
  if (typeof tech === 'string') return tech;
  if (tech && typeof tech === 'object' && 'name' in tech) return String((tech as { name: unknown }).name);
  return '';
}

async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/projects?limit=50`, { next: { revalidate: 60 } });
    return res.json();
  } catch {
    return { data: [] };
  }
}

export default async function ProjectsPage() {
  const { data: projects }: { data: Project[] } = await getProjects();

  return (
    <div className="page page-wide">
      <PageHeader
        label="Work"
        title="Things I have built and kept running"
        lede="Infrastructure, delivery pipelines and platforms — each one is something I operated, not only wrote."
      />

      {projects.length === 0 ? (
        <div className="panel px-8 py-20 text-center">
          <p className="text-muted-foreground">No projects yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const status = STATUS[project.status || ''] || { label: project.status?.replace('_', ' ') || 'Ongoing', className: '' };
            const techs = (project.technologies || []).map(techName).filter(Boolean);

            return (
              <TiltCard key={project.id} href={`/projects/${project.slug}`} className="panel flex flex-col p-6">
                {project.coverImage && (
                  <div className="-mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl">
                    <img src={project.coverImage} alt={project.title} className="h-40 w-full object-cover" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10.5px] uppercase tracking-[.09em] text-dim">
                    {project.role || 'Infrastructure'}
                  </span>
                  <span className={`status ${status.className}`}>{status.label}</span>
                </div>

                <h2 className="mt-4 text-[19px] font-medium leading-snug tracking-[-.02em]">{project.title}</h2>
                {project.description && (
                  <p className="mt-2.5 line-clamp-3 text-[14.2px] leading-relaxed text-muted-foreground">{project.description}</p>
                )}

                {techs.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {techs.slice(0, 5).map((tech) => (
                      <span key={tech} className="rounded-md border border-line bg-muted px-2 py-1 font-mono text-[10.5px] text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <span className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[.08em] text-warm">Open →</span>
              </TiltCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
