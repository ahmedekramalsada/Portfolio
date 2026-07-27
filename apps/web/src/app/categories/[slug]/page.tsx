const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';
import type { Metadata } from 'next';
import Link from 'next/link';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} — Blog — Ahmed Ekram Al Sada`, description: `Articles about ${slug}.` };
}

async function getPostsByCategory(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts?category=${slug}&limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data || [];
  } catch { return []; }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
      <p className="text-muted-foreground mb-8">{posts.length} article{posts.length !== 1 ? 's' : ''}</p>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No articles in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="block rounded-lg border bg-card p-6 transition-all hover:border-blue-500/30">
              <p className="text-xs text-muted-foreground mb-1">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
              </p>
              <h2 className="font-semibold text-lg hover:text-blue-500 transition-colors">{post.title}</h2>
              {post.excerpt && <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
