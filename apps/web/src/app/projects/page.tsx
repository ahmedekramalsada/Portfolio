const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects — Ahmed Ekram Al Sada',
  description: 'DevOps and software development projects by Ahmed Ekram Al Sada. Docker, Kubernetes, CI/CD, cloud infrastructure, and platform engineering.',
  openGraph: { title: 'Projects — Ahmed Ekram Al Sada', description: 'DevOps projects by Ahmed Ekram Al Sada.' },
};

async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/projects?limit=50`, { next: { revalidate: 60 } });
    return res.json();
  } catch {
    return { data: [] };
  }
}

export default async function ProjectsPage() {
  const { data: projects } = await getProjects();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="mt-2 text-lg text-muted-foreground">Things I&apos;ve built</p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed p-16 text-center">
          <p className="text-muted-foreground">No projects yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <a
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              {project.coverImage ? (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
              )}
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    project.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                    project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {project.status?.replace('_', ' ')}
                  </span>
                  {project.featured && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Featured</span>
                  )}
                </div>
                <h2 className="font-semibold group-hover:text-blue-500 transition-colors">{project.title}</h2>
                {project.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                )}
                {project.technologies?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.map((t: any) => (
                      <span key={t.id} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
