const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="mt-4 text-muted-foreground">The article you&apos;re looking for doesn&apos;t exist.</p>
        <a href="/blog" className="mt-6 inline-block text-sm text-primary hover:underline">
          ← Back to blog
        </a>
      </div>
    );
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8">
        <p className="mb-2 text-sm text-muted-foreground">
          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
          {post.category && <span> · {post.category.name}</span>}
          <span> · {post.readingTime || '5'} min read</span>
        </p>
        <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        )}
        {post.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag: any) => (
              <span key={tag.id} className="rounded-full bg-muted px-3 py-1 text-xs">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        {post.content ? (
          post.content.split('\n').map((line: string, i: number) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold mt-5 mb-2">{line.slice(4)}</h3>;
            if (line.startsWith('- ')) return <li key={i} className="ml-4 text-muted-foreground">{line.slice(2)}</li>;
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="mb-4 leading-relaxed text-muted-foreground">{line}</p>;
          })
        ) : (
          <p className="text-muted-foreground">No content yet.</p>
        )}
      </div>

      <div className="mt-12 pt-8 border-t">
        <a href="/blog" className="text-sm text-primary hover:underline">
          ← Back to blog
        </a>
      </div>
    </article>
  );
}
