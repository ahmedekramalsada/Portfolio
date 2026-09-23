const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/site/page-header';
import { Cover } from '@/components/site/cover';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles on DevOps, Docker, Kubernetes, CI/CD, AI engineering, and platform engineering by Ahmed Ekram Alsada.',
  openGraph: { title: 'Blog — Ahmed Ekram Alsada', description: 'DevOps articles by Ahmed Ekram Alsada.' },
};

async function getPosts(category?: string, page = 1, query?: string) {
  try {
    // A search term runs through the site-wide search endpoint and keeps only
    // articles. Searching looks across all writing, not just the open category.
    if (query) {
      const found = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, { next: { revalidate: 60 } });
      if (!found.ok) return { data: [], meta: { page: 1, total: 0, totalPages: 0 } };
      const results = await found.json();
      const hits = ((results.data || []) as { type: string }[]).filter((hit) => hit.type === 'post');
      return { data: hits, meta: { page: 1, total: hits.length, totalPages: 1 } };
    }

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
  const query = (params.q || '').trim();
  const { data: posts, meta } = await getPosts(category, page, query);
  const categories = await getCategories();

  const topicCats = categories.filter((c: { name: string }) =>
    ['DevOps', 'Docker', 'Kubernetes', 'Linux', 'AI', 'Tutorials', 'Career', 'Monitoring', 'Cloud', 'Backend', 'Frontend'].includes(c.name)
  );

  return (
    <div className="page page-wide">
      <PageHeader
        label="Writing"
        title="Latest posts"
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

      {/* Category filter — replaced by the result count while searching */}
      {query ? (
        <p className="mb-10 font-mono text-[11px] uppercase tracking-[.09em] text-dim">
          {posts.length} result{posts.length !== 1 ? 's' : ''} for “{query}” ·{' '}
          <Link href="/blog" className="text-warm hover:underline">clear</Link>
        </p>
      ) : (
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
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="panel px-8 py-20 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">Empty</p>
          <p className="mt-3 text-muted-foreground">
            No articles found{query ? ` for “${query}”` : category !== 'all' ? ' in this category' : ''}.
          </p>
          {query ? (
            <Link href="/blog" className="mt-4 inline-block text-[14px] text-warm hover:underline">All writing →</Link>
          ) : category !== 'all' ? (
            <Link href="/blog" className="mt-4 inline-block text-[14px] text-warm hover:underline">View all articles →</Link>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post: { id: string; slug: string; title: string; excerpt?: string; publishedAt?: string; coverImage?: string; readingTime?: number; category?: { name: string } }, i: number) => {
            const featured = i === 0 && posts.length > 1;
            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className={`pcard ${featured ? 'pcard-wide md:col-span-2' : ''}`}>
                <div className="pcard-media">
                  <Cover
                    src={post.coverImage}
                    alt={post.title}
                    fallback={(post.category?.name || post.title || '?')[0].toUpperCase()}
                  />
                </div>
                <div className={`pcard-body ${featured ? 'md:justify-center md:p-9' : ''}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.category && <span className="chip chip-on">{post.category.name}</span>}
                    {post.publishedAt && <span className="chip">{formatDate(post.publishedAt)}</span>}
                  </div>
                  <h2 className={`pcard-title ${featured ? 'md:text-[28px]' : ''}`}>{post.title}</h2>
                  {post.excerpt && <p className={`pcard-excerpt ${featured ? 'md:line-clamp-3' : 'line-clamp-2'}`}>{post.excerpt}</p>}
                  <div className="pcard-foot">
                    <span className="font-mono text-[10.5px] uppercase tracking-[.09em] text-dim">{post.readingTime || 5} min read</span>
                    <span className="font-mono text-[11px] uppercase tracking-[.08em] text-warm">Read →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && !query && (
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
