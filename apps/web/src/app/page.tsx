const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

async function fetchAPI(path: string) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function HomePage() {
  const [postsData, projectsData, skillsData, catsData] = await Promise.all([
    fetchAPI('/posts?limit=5&status=published'),
    fetchAPI('/projects?limit=4'),
    fetchAPI('/skills'),
    fetchAPI('/categories'),
  ]);

  const posts = postsData?.data || [];
  const projects = projectsData?.data || [];
  const skills = Array.isArray(skillsData) ? skillsData : [];
  const categories = Array.isArray(catsData) ? catsData : [];
  const featured = posts[0];
  const latest = posts.slice(1);

  const topicCategories = categories.filter((c: any) =>
    ['DevOps', 'Docker', 'Kubernetes', 'Linux', 'AI', 'Tutorials', 'Career', 'Monitoring'].includes(c.name)
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      {/* Hero */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur-md" />
              <img src="/profile.webp" alt="Ahmed Ekram Al Sada" width={140} height={140}
                className="relative rounded-full border border-border" fetchPriority="high" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-blue-500 font-medium mb-1">DevOps Engineer</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Ahmed Ekram Al Sada</h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mb-6">
              Building and automating production infrastructure at SmartSigma. 
              Docker, Kubernetes, CI/CD, cloud, and AI-powered automation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="/blog" className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">Read Blog</a>
              <a href="/projects" className="inline-flex items-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors">View Projects</a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Article</h2>
            <a href="/blog" className="text-sm text-blue-500 hover:text-blue-400">View all →</a>
          </div>
          <a href={`/blog/${featured.slug}`}
            className="block rounded-xl border bg-card p-8 transition-all hover:border-blue-500/30 hover:shadow-sm">
            <p className="text-xs text-muted-foreground mb-2">
              {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
              {featured.category && <span> · {featured.category.name}</span>}
            </p>
            <h3 className="text-2xl font-bold mb-3 hover:text-blue-500 transition-colors">{featured.title}</h3>
            {featured.excerpt && <p className="text-muted-foreground leading-relaxed">{featured.excerpt}</p>}
          </a>
        </section>
      )}

      {/* Latest Articles */}
      {latest.length > 0 && (
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {latest.map((post: any) => (
              <a key={post.id} href={`/blog/${post.slug}`}
                className="rounded-lg border bg-card p-5 transition-all hover:border-blue-500/30">
                <p className="text-xs text-muted-foreground mb-1">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                  {post.category && <span> · {post.category.name}</span>}
                </p>
                <h3 className="font-semibold hover:text-blue-500 transition-colors">{post.title}</h3>
                {post.excerpt && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Browse Topics */}
      {topicCategories.length > 0 && (
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Browse Topics</h2>
          <div className="flex flex-wrap gap-2">
            {topicCategories.map((cat: any) => (
              <a key={cat.id} href={`/categories/${cat.slug || cat.name.toLowerCase()}`}
                className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-accent hover:border-blue-500/30 transition-all">
                {cat.name}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>
            <a href="/projects" className="text-sm text-blue-500 hover:text-blue-400">View all →</a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project: any) => (
              <a key={project.id} href={`/projects/${project.slug}`}
                className="rounded-lg border bg-card p-5 transition-all hover:border-blue-500/30">
                <h3 className="font-semibold hover:text-blue-500 transition-colors">{project.title}</h3>
                {project.description && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{project.description}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section className="mb-20 rounded-xl border bg-card p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-4">About Me</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          I&apos;m a DevOps engineer at SmartSigma in Cairo, managing production infrastructure across 7 servers. 
          I specialize in Docker, Kubernetes, CI/CD pipelines, cloud infrastructure, and AI-powered automation.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Currently building <strong>Ahmed OS</strong> — a personal developer platform with AI agents, 
          RAG pipelines, and full-stack TypeScript. I also hold an AWS Certified Cloud Practitioner certification.
        </p>
        <a href="/about" className="text-sm text-blue-500 hover:text-blue-400">More about me →</a>
      </section>

      {/* Footer CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-2">Stay in Touch</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Follow me on LinkedIn for DevOps tips, AI experiments, and infrastructure stories.
        </p>
        <div className="flex justify-center gap-3">
          <a href="/contact" className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">Contact Me</a>
          <a href="https://linkedin.com/in/ahmedekramalsada" target="_blank" className="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors">LinkedIn</a>
        </div>
      </section>
    </div>
  );
}
