const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';
import { ShareButtons } from '@/components/share-buttons';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const post = await res.json();
    return {
      title: `${post.title} — Ahmed Ekram Al Sada`,
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
    return posts.filter((p: any) => p.slug !== currentSlug).slice(0, 2);
  } catch { return []; }
}

function extractHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  for (const line of content.split('\n')) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ level: match[1].length, text, id });
    }
  }
  return headings;
}

function renderContent(content: string) {
  return content.split('\n').map((line: string, i: number) => {
    const heading = line.match(/^(#{1,3})\s+(.+)/);
    if (heading) {
      const text = heading[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (heading[1].length === 1) return <h1 key={i} id={id} className="text-3xl font-bold mt-8 mb-4">{text}</h1>;
      if (heading[1].length === 2) return <h2 key={i} id={id} className="text-2xl font-bold mt-6 mb-3">{text}</h2>;
      return <h3 key={i} id={id} className="text-xl font-semibold mt-5 mb-2">{text}</h3>;
    }
    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-muted-foreground mb-1">{line.slice(2)}</li>;
    if (line.startsWith('```')) return null;
    if (line.trim() === '') return <br key={i} />;
    // Code inline detection
    if (line.includes('`')) {
      const parts = line.split(/(`[^`]+`)/);
      return <p key={i} className="mb-4 leading-relaxed text-muted-foreground">{parts.map((p, j) =>
        p.startsWith('`') && p.endsWith('`') ? <code key={j} className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">{p.slice(1, -1)}</code> : <span key={j}>{p}</span>
      )}</p>;
    }
    return <p key={i} className="mb-4 leading-relaxed text-muted-foreground">{line}</p>;
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="mt-4 text-muted-foreground">The article you&apos;re looking for doesn&apos;t exist.</p>
        <a href="/blog" className="mt-6 inline-block text-sm text-blue-500 hover:underline">← Back to blog</a>
      </div>
    );
  }

  const headings = extractHeadings(post.content || '');
  const related = await getRelatedPosts(post.category?.slug, slug);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
        {/* Article */}
        <article>
          <div className="mb-8">
            <p className="mb-2 text-sm text-muted-foreground">
              {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {post.category && <span> · {post.category.name}</span>}
              <span> · {post.readingTime || '5'} min read</span>
            </p>
            <h1 className="text-3xl font-bold md:text-4xl mb-4">{post.title}</h1>
            {post.coverImage && post.coverImage !== '' && (
              <img src={post.coverImage} alt={post.title} className="w-full rounded-lg object-cover max-h-96 mb-6" />
            )}
            {post.excerpt && <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>}
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {post.content ? renderContent(post.content) : <p className="text-muted-foreground">No content yet.</p>}
          </div>

          <div className="mt-12 pt-8 border-t flex items-center justify-between">
            <a href="/blog" className="text-sm text-blue-500 hover:underline">← Back to blog</a>
            <ShareButtons title={post.title} url={`https://ahmedekram.site/blog/${post.slug}`} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold mb-3">Table of Contents</p>
                <nav className="space-y-1.5">
                  {headings.map((h, i) => (
                    <a key={i} href={`#${h.id}`}
                      className={`block text-sm text-muted-foreground hover:text-foreground transition-colors ${h.level === 2 ? 'pl-4' : h.level === 3 ? 'pl-8' : ''}`}>
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Related Articles */}
            {related.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">Related Articles</p>
                <div className="space-y-3">
                  {related.map((r: any) => (
                    <a key={r.id} href={`/blog/${r.slug}`} className="block rounded-lg border bg-card p-3 hover:border-blue-500/30 transition-colors">
                      <p className="text-xs text-muted-foreground">{new Date(r.publishedAt).toLocaleDateString()}</p>
                      <p className="text-sm font-medium mt-1 hover:text-blue-500 transition-colors">{r.title}</p>
                    </a>
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
