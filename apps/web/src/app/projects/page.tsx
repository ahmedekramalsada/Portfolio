const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

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
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold">Projects</h1>
      <p className="mb-8 text-lg text-muted-foreground">Things I&apos;ve built</p>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <a
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group rounded-lg border p-6 transition-all hover:bg-accent hover:shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  project.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {project.status?.replace('_', ' ')}
                </span>
                {project.featured && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
                {project.title}
              </h2>
              {project.description && (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                  {project.description}
                </p>
              )}

              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t: any) => (
                    <span key={t.id} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
