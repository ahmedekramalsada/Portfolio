const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

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
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No articles yet. Check back soon.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post: any) => (
            <article key={post.id} className="group border-b pb-8">
              <a href={`/blog/${post.slug}`}>
                <p className="mb-1 text-sm text-muted-foreground">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  }) : 'Draft'}
                  {post.category && <span> · {post.category.name}</span>}
                </p>
                <h2 className="text-xl font-semibold group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-muted-foreground line-clamp-2">{post.excerpt}</p>
                )}
                {post.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag: any) => (
                      <span key={tag.id} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-4">
          {page > 1 && (
            <a href={`/blog?page=${page - 1}`} className="text-sm hover:text-primary">
              ← Previous
            </a>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {meta.totalPages}
          </span>
          {page < meta.totalPages && (
            <a href={`/blog?page=${page + 1}`} className="text-sm hover:text-primary">
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
