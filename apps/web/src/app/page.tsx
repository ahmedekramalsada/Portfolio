const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

async function fetchAPI(path: string) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [postsData, projectsData] = await Promise.all([
    fetchAPI('/posts?limit=3&status=published'),
    fetchAPI('/projects?limit=6'),
  ]);

  const posts = postsData?.data || [];
  const projects = projectsData?.data || [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-20">
      {/* Hero */}
      <section className="mb-32 flex flex-col items-center gap-8 md:flex-row md:gap-16">
        <div className="shrink-0">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-lg" />
            <img
              src="/profile.webp"
              alt="Ahmed Ekram Al Sada"
              width={160}
              height={160}
              className="relative rounded-full border-2 border-border"
              fetchPriority="high"
            />
          </div>
        </div>
        <div className="text-center md:text-left">
          <p className="mb-2 text-sm font-medium text-blue-500">Hello, I&apos;m</p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Ahmed Ekram Al Sada
          </h1>
          <p className="mb-4 text-xl text-muted-foreground">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              DevOps Engineer & Software Architect
            </span>
          </p>
          <p className="mb-8 max-w-xl text-muted-foreground leading-relaxed">
            Building production-grade systems at SmartSigma. Specializing in Docker, Kubernetes,
            CI/CD, cloud infrastructure, and AI-powered platform engineering.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90"
            >
              View Projects
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              Download Resume
            </a>
          </div>
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-32">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Projects</h2>
              <p className="text-sm text-muted-foreground mt-1">Things I&apos;ve built</p>
            </div>
            <a href="/projects" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
              View all →
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project: any) => (
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
                  </div>
                  <h3 className="font-semibold group-hover:text-blue-500 transition-colors">{project.title}</h3>
                  {project.description && (
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
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
        </section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <section className="mb-32">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Latest Articles</h2>
              <p className="text-sm text-muted-foreground mt-1">Thoughts on DevOps, AI, and engineering</p>
            </div>
            <a href="/blog" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
              View all →
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post: any) => (
              <a key={post.id} href={`/blog/${post.slug}`} className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
                <p className="mb-3 text-xs text-muted-foreground">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  }) : 'Draft'}
                  {post.category && <span> · {post.category.name}</span>}
                </p>
                <h3 className="font-semibold group-hover:text-blue-500 transition-colors">{post.title}</h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                )}
                {post.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag: any) => (
                      <span key={tag.id} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-500/5 via-transparent to-purple-600/5 p-12 text-center">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative">
          <h2 className="mb-3 text-2xl font-bold">Let&apos;s Work Together</h2>
          <p className="mb-6 text-muted-foreground max-w-md mx-auto">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90"
          >
            Get in Touch
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </section>
    </div>
  );
}
