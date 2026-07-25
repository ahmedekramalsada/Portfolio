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
  const [postsData, projectsData, skillsData, expData] = await Promise.all([
    fetchAPI('/posts?limit=3&status=published'),
    fetchAPI('/projects?limit=4'),
    fetchAPI('/skills'),
    fetchAPI('/experiences'),
  ]);

  const posts = postsData?.data || [];
  const projects = projectsData?.data || [];
  const skills = Array.isArray(skillsData) ? skillsData : [];
  const experiences = Array.isArray(expData) ? expData : [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-20">
      {/* 1. HERO */}
      <section className="mb-24">
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur-md" />
              <img src="/profile.webp" alt="Ahmed Ekram Al Sada" width={140} height={140}
                className="relative rounded-full border border-border" fetchPriority="high" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="mb-1 text-sm text-blue-500 font-medium">DevOps Engineer</p>
            <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">Ahmed Ekram Al Sada</h1>
            <p className="mb-6 max-w-xl text-muted-foreground leading-relaxed">
              Building and maintaining production infrastructure at SmartSigma. 
              Specializing in Docker, Kubernetes, CI/CD, cloud infrastructure, and platform engineering.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="/projects" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                View Projects
              </a>
              <a href="/resume" className="inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors">
                Resume
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPERIENCE */}
      {experiences.length > 0 && (
        <section className="mb-24">
          <h2 className="mb-8 text-2xl font-bold">Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp: any) => (
              <div key={exp.id} className="border-l-2 border-blue-500/30 pl-6">
                <p className="text-sm text-blue-500 font-medium">{exp.position}</p>
                <p className="font-semibold">{exp.company}</p>
                {exp.startDate && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    {exp.endDate ? ` — ${new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ' — Present'}
                  </p>
                )}
                {exp.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. SKILLS */}
      {skills.length > 0 && (
        <section className="mb-24">
          <h2 className="mb-6 text-2xl font-bold">Skills</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill: any) => (
              <div key={skill.id} className="rounded-lg border bg-card px-4 py-3">
                <p className="text-sm font-medium">{skill.name}</p>
                {skill.category && <p className="text-xs text-muted-foreground mt-0.5">{skill.category}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. PROJECTS */}
      {projects.length > 0 && (
        <section className="mb-24">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Projects</h2>
            <a href="/projects" className="text-sm text-blue-500 hover:text-blue-400">View all →</a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project: any) => (
              <a key={project.id} href={`/projects/${project.slug}`}
                className="group rounded-lg border bg-card p-5 transition-all hover:border-blue-500/30 hover:shadow-sm">
                <h3 className="font-semibold group-hover:text-blue-500 transition-colors">{project.title}</h3>
                {project.description && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{project.description}</p>}
                {project.technologies?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.map((t: any) => (
                      <span key={t.id} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t.name}</span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 5. BLOG */}
      {posts.length > 0 && (
        <section className="mb-24">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <a href="/blog" className="text-sm text-blue-500 hover:text-blue-400">View all →</a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((post: any) => (
              <a key={post.id} href={`/blog/${post.slug}`}
                className="group rounded-lg border bg-card p-5 transition-all hover:border-blue-500/30 hover:shadow-sm">
                <p className="mb-2 text-xs text-muted-foreground">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                  {post.category && <span> · {post.category.name}</span>}
                </p>
                <h3 className="font-semibold group-hover:text-blue-500 transition-colors">{post.title}</h3>
                {post.excerpt && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 6. CONTACT */}
      <section className="rounded-lg border bg-card p-10 text-center">
        <h2 className="mb-2 text-2xl font-bold">Get in Touch</h2>
        <p className="mb-6 text-muted-foreground max-w-md mx-auto">
          Interested in working together or have a question? Let&apos;s talk.
        </p>
        <a href="/contact" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Contact Me
        </a>
      </section>
    </div>
  );
}
