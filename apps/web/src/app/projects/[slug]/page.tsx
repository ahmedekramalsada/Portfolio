const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

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
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <a href="/projects" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← Back to projects
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <a href="/projects" className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Back to projects
      </a>

      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
            project.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
          }`}>
            {project.status?.replace('_', ' ')}
          </span>
          {project.featured && <span className="text-xs text-muted-foreground">Featured</span>}
        </div>

        <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>

        {project.technologies?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((t: any) => (
              <span key={t.id} className="rounded-full bg-muted px-3 py-1 text-sm">
                {t.name} {t.icon && ` ${t.icon}`}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-4">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
              GitHub →
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
              Live Demo →
            </a>
          )}
        </div>
      </div>

      {project.description && (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">{project.description}</p>
        </div>
      )}

      {project.content && (
        <div className="mt-8 prose prose-gray dark:prose-invert max-w-none">
          {project.content.split('\n').map((line: string, i: number) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
          })}
        </div>
      )}

      <div className="mt-12 pt-8 border-t">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {project.role && <div><span className="text-muted-foreground">Role:</span> {project.role}</div>}
          {project.difficulty && <div><span className="text-muted-foreground">Difficulty:</span> {project.difficulty}</div>}
          {project.startDate && (
            <div><span className="text-muted-foreground">Started:</span> {new Date(project.startDate).toLocaleDateString()}</div>
          )}
          {project.endDate && (
            <div><span className="text-muted-foreground">Completed:</span> {new Date(project.endDate).toLocaleDateString()}</div>
          )}
        </div>
      </div>
    </div>
  );
}
