const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Ahmed Ekram Al Sada',
  description: 'Articles on DevOps, Docker, Kubernetes, CI/CD, AI engineering, and platform engineering by Ahmed Ekram Al Sada.',
  openGraph: { title: 'Blog — Ahmed Ekram Al Sada', description: 'DevOps articles by Ahmed Ekram Al Sada.' },
};

async function getPosts(category?: string, page = 1) {
  try {
    let url = `${API_URL}/posts?page=${page}&limit=20&status=published`;
    if (category && category !== 'all') url += `&category=${category}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    return res.json();
  } catch {
    return { data: [], meta: { page: 1, total: 0, totalPages: 0 } };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 300 } });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string; q?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category || 'all';
  const { data: posts, meta } = await getPosts(category, page);
  const categories = await getCategories();

  const topicCats = categories.filter((c: any) =>
    ['DevOps', 'Docker', 'Kubernetes', 'Linux', 'AI', 'Tutorials', 'Career', 'Monitoring', 'Cloud', 'Backend', 'Frontend'].includes(c.name)
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-lg text-muted-foreground">DevOps, AI, cloud infrastructure, and platform engineering</p>
      </div>

      {/* Search */}
      <form method="GET" action="/blog" className="mb-6">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input name="q" type="search" placeholder="Search articles..." defaultValue={params.q || ''}
            className="w-full rounded-lg border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
        </div>
      </form>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a href="/blog" className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border ${category === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'border-border hover:border-blue-500/30 hover:bg-accent'}`}>All</a>
        {topicCats.map((cat: any) => (
          <a key={cat.id} href={`/blog?category=${cat.slug || cat.name.toLowerCase()}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border ${category === (cat.slug || cat.name.toLowerCase()) ? 'bg-blue-600 text-white border-blue-600' : 'border-border hover:border-blue-500/30 hover:bg-accent'}`}>
            {cat.name}
          </a>
        ))}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-16 text-center">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-muted-foreground">No articles found{category !== 'all' ? ' in this category' : ''}.</p>
          {category !== 'all' && <a href="/blog" className="text-sm text-blue-500 hover:text-blue-400 mt-2 inline-block">View all articles →</a>}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post: any, i: number) => (
            <a key={post.id} href={`/blog/${post.slug}`}
              className={`group rounded-xl border bg-card transition-all hover:border-blue-500/30 hover:shadow-sm ${i === 0 ? 'md:col-span-2' : ''}`}>
              {post.coverImage && (
                <div className="overflow-hidden rounded-t-xl">
                  <img src={post.coverImage} alt="" className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
                  {post.category && <span>· {post.category.name}</span>}
                  <span>· {post.readingTime || '5'} min read</span>
                </div>
                <h2 className={`font-semibold group-hover:text-blue-500 transition-colors ${i === 0 ? 'text-xl' : ''}`}>{post.title}</h2>
                {post.excerpt && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          {page > 1 && (
            <a href={`/blog?page=${page - 1}${category !== 'all' ? `&category=${category}` : ''}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Previous
            </a>
          )}
          <span className="text-sm text-muted-foreground">Page {page} of {meta.totalPages}</span>
          {page < meta.totalPages && (
            <a href={`/blog?page=${page + 1}${category !== 'all' ? `&category=${category}` : ''}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Next
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
