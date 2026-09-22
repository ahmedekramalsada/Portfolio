const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';
import type { Metadata } from 'next';
import Link from 'next/link';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '), description: `Articles about ${slug}.` };
}

async function getPostsByCategory(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts?category=${slug}&limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data || [];
  } catch { return []; }
}

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <div className="page">
      <header className="mb-12">
        <span className="label">Topic</span>
        <h1 className="h1 mt-5">{categoryName}</h1>
        <p className="lede">
          {posts.length} article{posts.length !== 1 ? 's' : ''} filed under this topic.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="panel px-8 py-20 text-center">
          <p className="text-muted-foreground">No articles in this category yet.</p>
          <Link href="/blog" className="mt-4 inline-block text-[14px] text-warm hover:underline">All writing →</Link>
        </div>
      ) : (
        <div>
          {posts.map((post: { id: string; slug: string; title: string; excerpt?: string; publishedAt?: string }) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="wrow group">
              <div className="min-w-0">
                <h2 className="wtitle text-[19px] font-medium leading-snug tracking-[-.02em] transition-colors">{post.title}</h2>
                {post.excerpt && <p className="mt-2 line-clamp-1 text-[14.2px] text-muted-foreground">{post.excerpt}</p>}
              </div>
              <span className="shrink-0 font-mono text-[11.5px] uppercase tracking-[.08em] text-dim">
                {formatDate(post.publishedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
