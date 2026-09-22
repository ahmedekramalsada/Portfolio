const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';
import { ArticleContent, extractHeadings } from '@/components/site/article-content';
import { Cover } from '@/components/site/cover';
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
  const authorName: string = post.author?.name || 'Ahmed Ekram Al Sada';
  const initials = authorName.split(' ').filter(Boolean).slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
  const minutes = post.readingTime || Math.max(1, Math.round((post.content || '').split(/\s+/).length / 200));

  return (
    <div className="page page-wide">
      <Link
        href="/blog"
        className="mb-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.1em] text-dim transition hover:text-warm"
      >
        ← Writing
      </Link>

      {/* Hero: colour wash, the category as the one strong accent, then the title */}
      <header className="ahero mb-14">
        <div className="ahero-body">
          <div className="ahero-meta">
            {post.category && <span className="chip chip-on">{post.category.name}</span>}
            {post.publishedAt && <span className="chip">{formatDate(post.publishedAt)}</span>}
            <span className="chip">{minutes} min read</span>
          </div>

          <h1 className="ahero-title">{post.title}</h1>
          {post.excerpt && <p className="ahero-lede">{post.excerpt}</p>}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-line-2 bg-muted font-mono text-[12px] text-warm">
                {initials}
              </span>
              <div>
                <p className="text-[14px] font-medium">{authorName}</p>
                <p className="font-mono text-[10.5px] uppercase tracking-[.09em] text-dim">DevOps Engineer</p>
              </div>
            </div>
            <ShareButtons title={post.title} url={`https://ahmedekram.site/blog/${post.slug}`} />
          </div>
        </div>

        {post.coverImage && post.coverImage !== '' && (
          <div className="ahero-cover">
            <Cover
              src={post.coverImage}
              alt={post.title}
              fallback={(post.category?.name || post.title || '?')[0].toUpperCase()}
              fallbackFontSize="4.5rem"
            />
          </div>
        )}
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
        <article>
          <div className="article">
            {post.content ? (
              <ArticleContent content={post.content} muteHeading={post.title} />
            ) : (
              <p className="text-muted-foreground">No content yet.</p>
            )}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-8">
            <Link href="/blog" className="text-[14px] text-muted-foreground transition hover:text-warm">← Back to writing</Link>
            <ShareButtons title={post.title} url={`https://ahmedekram.site/blog/${post.slug}`} />
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-28">
            {headings.length > 1 && (
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
                <p className="label mb-4">More like this</p>
                <div className="flex flex-col gap-3">
                  {related.map((r: { id: string; slug: string; title: string; publishedAt?: string; coverImage?: string }) => (
                    <Link key={r.id} href={`/blog/${r.slug}`} className="panel block overflow-hidden transition hover:border-line-2">
                      <div className="pcard-media" style={{ aspectRatio: '16 / 7' }}>
                        <Cover
                          src={r.coverImage}
                          alt={r.title}
                          fallback={(r.title || '?')[0].toUpperCase()}
                          fallbackFontSize="1.5rem"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-mono text-[10.5px] uppercase tracking-[.08em] text-dim">{formatDate(r.publishedAt)}</p>
                        <p className="mt-2 text-[14px] font-medium leading-snug">{r.title}</p>
                      </div>
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
