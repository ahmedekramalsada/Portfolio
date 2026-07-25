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
    fetchAPI('/projects?limit=3'),
  ]);

  const posts = postsData?.data || [];
  const projects = projectsData?.data || [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="mb-24 flex flex-col md:flex-row items-center gap-8">
        {/* Profile Photo */}
        <div className="shrink-0">
          <img
            src="/profile.webp"
            alt="Ahmed Ekram Al Sada"
            width={180}
            height={180}
            className="rounded-full border-4 border-primary/20"
            fetchpriority="high"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
          Ahmed Ekram Al Sada
        </h1>
        <p className="mb-4 text-xl text-muted-foreground">
          DevOps Engineer & Software Architect
        </p>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
          Building production-grade systems at SmartSigma. Specializing in Docker, Kubernetes,
          CI/CD, cloud infrastructure, and AI-powered platform engineering.
        </p>
        <div className="flex gap-4">
          <a
            href="/projects"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Projects
          </a>
          <a
            href="/resume"
            className="rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Download Resume
          </a>
        </div>
        </div>
      </section>

      {/* Latest Articles */}
      {posts.length > 0 && (
        <section className="mb-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              View all →
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post: any) => (
              <a key={post.id} href={`/blog/${post.slug}`} className="group rounded-lg border p-6 transition-colors hover:bg-accent">
                <p className="mb-2 text-xs text-muted-foreground">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                  {post.category && ` · ${post.category.name}`}
                </p>
                <h3 className="mb-2 font-semibold group-hover:text-primary">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="mb-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Projects</h2>
            <a href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
              View all →
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project: any) => (
              <a key={project.id} href={`/projects/${project.slug}`} className="group rounded-lg border p-6 transition-colors hover:bg-accent">
                <h3 className="mb-2 font-semibold group-hover:text-primary">{project.title}</h3>
                {project.description && (
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                )}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t: any) => (
                      <span key={t.id} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{t.name}</span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="rounded-lg border bg-accent/50 p-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Let&apos;s Work Together</h2>
        <p className="mb-6 text-muted-foreground">
          I&apos;m always open to discussing new projects, creative ideas, or opportunities.
        </p>
        <a
          href="/contact"
          className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
}
