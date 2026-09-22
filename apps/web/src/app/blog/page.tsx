const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/site/page-header';

export const metadata: Metadata = {
  title: 'Blog',
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

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string; q?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category || 'all';
  const { data: posts, meta } = await getPosts(category, page);
  const categories = await getCategories();

  const topicCats = categories.filter((c: { name: string }) =>
    ['DevOps', 'Docker', 'Kubernetes', 'Linux', 'AI', 'Tutorials', 'Career', 'Monitoring', 'Cloud', 'Backend', 'Frontend'].includes(c.name)
  );

  return (
    <div className="page page-wide">
      <PageHeader
        label="Writing"
        title="Notes from production"
        lede="DevOps, cloud infrastructure and platform engineering — written from what actually broke, and what fixed it."
      />

      {/* Search */}
      <form method="GET" action="/blog" className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            name="q"
            type="search"
            placeholder="Search articles…"
            defaultValue={params.q || ''}
            className="field pl-10"
          />
        </div>
      </form>

      {/* Category filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Link href="/blog" className={`chip ${category === 'all' ? 'chip-on' : ''}`}>All</Link>
        {topicCats.map((cat: { id: string; name: string; slug?: string }) => {
          const slug = cat.slug || cat.name.toLowerCase();
          return (
            <Link key={cat.id} href={`/blog?category=${slug}`} className={`chip ${category === slug ? 'chip-on' : ''}`}>
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="panel px-8 py-20 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">Empty</p>
          <p className="mt-3 text-muted-foreground">No articles found{category !== 'all' ? ' in this category' : ''}.</p>
          {category !== 'all' && <Link href="/blog" className="mt-4 inline-block text-[14px] text-warm hover:underline">View all articles →</Link>}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post: { id: string; slug: string; title: string; excerpt?: string; publishedAt?: string; coverImage?: string; readingTime?: number; category?: { name: string } }, i: number) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`group panel block overflow-hidden transition-all hover:border-line-2 ${i === 0 ? 'md:col-span-2' : ''}`}
            >
              {post.coverImage && (
                <div className="overflow-hidden">
                  <img src={post.coverImage} alt="" className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
              )}
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[.08em] text-dim">
                  {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                  {post.category && <span>· {post.category.name}</span>}
                  <span>· {post.readingTime || '5'} min read</span>
                </div>
                <h2 className={`mt-3 font-medium leading-snug tracking-[-.02em] transition-colors group-hover:text-warm ${i === 0 ? 'text-[26px]' : 'text-[19px]'}`}>
                  {post.title}
                </h2>
                {post.excerpt && <p className="mt-3 line-clamp-2 text-[14.5px] leading-relaxed text-muted-foreground">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-6">
          {page > 1 && (
            <Link
              href={`/blog?page=${page - 1}${category !== 'all' ? `&category=${category}` : ''}`}
              className="btn-ghost"
            >
              ← Previous
            </Link>
          )}
          <span className="font-mono text-[11.5px] uppercase tracking-[.08em] text-dim">
            Page {page} of {meta.totalPages}
          </span>
          {page < meta.totalPages && (
            <Link href={`/blog?page=${page + 1}${category !== 'all' ? `&category=${category}` : ''}`} className="btn-ghost">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
