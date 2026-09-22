const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';
import { ArticleContent, extractHeadings } from '@/components/site/article-content';
import { ShareButtons } from '@/components/share-buttons';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const post = await res.json();
    return {
      title: post.title,
      description: post.excerpt || post.title,
      openGraph: { title: post.title, description: post.excerpt || post.title, images: post.coverImage ? [{ url: post.coverImage }] : [] },
    };
  } catch { return {}; }
}

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getRelatedPosts(categorySlug?: string, currentSlug?: string) {
  if (!categorySlug) return [];
  try {
    const res = await fetch(`${API_URL}/posts?category=${categorySlug}&limit=3`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    const posts = data.data || data || [];
    return posts.filter((p: { slug: string }) => p.slug !== currentSlug).slice(0, 2);
  } catch { return []; }
}

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="page text-center">
        <p className="label">404</p>
        <h1 className="h1 mt-4">Article not found</h1>
        <p className="lede mx-auto">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/blog" className="btn-ghost mt-8">← Back to writing</Link>
      </div>
    );
  }

  const headings = extractHeadings(post.content || '');
  const related = await getRelatedPosts(post.category?.slug, slug);

  return (
    <div className="page page-wide">
      <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-14">
        <article>
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[.09em] text-dim">
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {post.category && <span>· {post.category.name}</span>}
              <span>· {post.readingTime || '5'} min read</span>
            </div>
            <h1 className="h1 mt-5 max-w-[30ch]">{post.title}</h1>
            {post.coverImage && post.coverImage !== '' && (
              <img src={post.coverImage} alt={post.title} className="mt-7 max-h-96 w-full rounded-2xl border border-line object-cover" />
            )}
            {post.excerpt && <p className="lede">{post.excerpt}</p>}
          </header>

          <div className="article rule pt-10">
            {post.content ? <ArticleContent content={post.content} /> : <p className="text-muted-foreground">No content yet.</p>}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-8">
            <Link href="/blog" className="text-[14px] text-muted-foreground transition hover:text-warm">← Back to writing</Link>
            <ShareButtons title={post.title} url={`https://ahmedekram.site/blog/${post.slug}`} />
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-28">
            {headings.length > 0 && (
              <nav className="mb-10">
                <p className="label mb-4">On this page</p>
                <div className="flex flex-col gap-2 border-l border-line">
                  {headings.map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.id}`}
                      className={`text-[13.5px] leading-snug text-muted-foreground transition hover:text-warm ${
                        h.level === 2 ? 'pl-6' : h.level === 3 ? 'pl-9' : 'pl-3'
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            {related.length > 0 && (
              <div>
                <p className="label mb-4">Related</p>
                <div className="flex flex-col gap-3">
                  {related.map((r: { id: string; slug: string; title: string; publishedAt?: string }) => (
                    <Link key={r.id} href={`/blog/${r.slug}`} className="panel block p-4 transition hover:border-line-2">
                      <p className="font-mono text-[10.5px] uppercase tracking-[.08em] text-dim">{formatDate(r.publishedAt)}</p>
                      <p className="mt-2 text-[14px] font-medium leading-snug">{r.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
