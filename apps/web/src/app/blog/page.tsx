const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Ahmed Ekram Al Sada',
  description: 'Articles on DevOps, Docker, Kubernetes, CI/CD, AI engineering, and platform engineering by Ahmed Ekram Al Sada.',
  openGraph: { title: 'Blog — Ahmed Ekram Al Sada', description: 'DevOps articles by Ahmed Ekram Al Sada.' },
};

async function getPosts(page = 1) {
  try {
    const res = await fetch(`${API_URL}/posts?page=${page}&limit=20&status=published`, {
      next: { revalidate: 60 },
    });
    return res.json();
  } catch {
    return { data: [], meta: { page: 1, total: 0, totalPages: 0 } };
  }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: posts, meta } = await getPosts(page);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">Thoughts on DevOps, AI, and platform engineering</p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-16 text-center">
          <p className="text-muted-foreground">No articles yet. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post: any) => (
            <a key={post.id} href={`/blog/${post.slug}`} className="group block rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
              <p className="mb-2 text-sm text-muted-foreground">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                }) : 'Draft'}
                {post.category && <span> · {post.category.name}</span>}
                <span> · {post.readingTime || '5'} min read</span>
              </p>
              <h2 className="text-xl font-semibold group-hover:text-blue-500 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-muted-foreground line-clamp-2">{post.excerpt}</p>
              )}
              {post.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((tag: any) => (
                    <span key={tag.id} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          {page > 1 && (
            <a href={`/blog?page=${page - 1}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Previous
            </a>
          )}
          <span className="text-sm text-muted-foreground">Page {page} of {meta.totalPages}</span>
          {page < meta.totalPages && (
            <a href={`/blog?page=${page + 1}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Next
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
