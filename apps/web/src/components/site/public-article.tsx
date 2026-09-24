import Link from 'next/link';
import { Cover } from '@/components/site/cover';
import { ShareButtons } from '@/components/share-buttons';
import { ArticleContent, extractHeadings } from '@/components/site/article-content';
import { JsonLd } from '@/components/site/json-ld';
import { localePath, type Locale } from '@/lib/site-content';
import { formatDate, getPost, getPosts } from '@/lib/public-content';
import { notFound } from 'next/navigation';

const copy = {
  en: { writing: 'Writing', back: 'Back to writing', min: 'min read', notFound: 'Article not found', notFoundLede: 'The article you are looking for does not exist in this language.', more: 'More like this', share: 'Share' },
  ar: { writing: 'الكتابة', back: 'العودة للكتابة', min: 'دقيقة قراءة', notFound: 'المقال غير موجود', notFoundLede: 'المقال الذي تبحث عنه غير متاح بهذه اللغة.', more: 'محتوى مشابه', share: 'مشاركة' },
} as const;

export async function PublicArticle({ locale, slug }: { locale: Locale; slug: string }) {
  const post = await getPost(slug, locale);
  if (!post) notFound();
  const t = copy[locale];
  const headings = extractHeadings(post.content || '');
  const { data: relatedData } = await getPosts({ locale, limit: 3 });
  const related = relatedData.filter((item) => item.slug !== slug).slice(0, 2);
  const authorName = post.author?.name || (locale === 'ar' ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada');
  const initials = authorName.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  const minutes = post.readingTime || Math.max(1, Math.round((post.content || '').split(/\s+/).length / 200));
  const url = `https://ahmedekram.site${localePath(locale, `/blog/${post.slug}`)}`;

  return <div className="page page-wide" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#BlogPosting`, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, url, headline: post.title, description: post.seoDescription || post.excerpt || post.title, inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US', datePublished: post.publishedAt || undefined, dateModified: post.updatedAt || post.publishedAt || undefined, author: { '@type': 'Person', name: authorName, url: `https://ahmedekram.site${localePath(locale, '/about')}` }, publisher: { '@type': 'Person', name: locale === 'ar' ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada', url: 'https://ahmedekram.site' }, image: post.coverImage || undefined, keywords: post.tags?.map((tag) => tag.name).join(', ') || undefined, isPartOf: { '@type': 'Blog', name: locale === 'ar' ? 'كتابة أحمد أكرم السادة' : 'Ahmed Ekram Alsada Writing', url: `https://ahmedekram.site${localePath(locale, '/blog')}` } }} />
    <Link href={localePath(locale, '/blog')} className="mb-7 inline-flex min-h-[36px] items-center gap-2 font-mono text-[11.5px] uppercase tracking-[.1em] text-dim transition hover:text-warm">← {t.back}</Link>
    <header className="ahero mb-14"><div className="ahero-body"><div className="ahero-meta">{post.category && <span className="chip chip-on">{post.category.name}</span>}{post.publishedAt && <span className="chip">{formatDate(post.publishedAt, locale)}</span>}<span className="chip">{minutes} {t.min}</span></div><h1 className="ahero-title">{post.title}</h1>{post.excerpt && <p className="ahero-lede">{post.excerpt}</p>}<div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full border border-line-2 bg-muted font-mono text-[12px] text-warm">{initials}</span><div><p className="text-[14px] font-medium">{authorName}</p><p className="font-mono text-[10.5px] uppercase tracking-[.09em] text-dim">DevOps Engineer · Cairo</p></div></div><ShareButtons title={post.title} url={url} locale={locale} label={t.share} /></div></div>{post.coverImage && <div className="ahero-cover"><Cover src={post.coverImage} alt={post.title} fallback={(post.title || '?')[0].toUpperCase()} fallbackFontSize="4.5rem" /></div>}</header>
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16"><article><div className="article">{post.content ? <ArticleContent content={post.content} muteHeading={post.title} /> : <p className="text-muted-foreground">{locale === 'ar' ? 'لا يوجد محتوى بعد.' : 'No content yet.'}</p>}</div><div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-8"><Link href={localePath(locale, '/blog')} className="inline-flex min-h-[36px] items-center text-[14.5px] text-muted-foreground transition hover:text-warm">← {t.back}</Link><ShareButtons title={post.title} url={url} locale={locale} label={t.share} /></div></article><aside className="hidden lg:block"><div className="sticky top-28">{headings.length > 1 && <nav className="mb-10"><p className="label mb-4">{locale === 'ar' ? 'في هذه الصفحة' : 'On this page'}</p><div className="flex flex-col gap-2 border-l border-line">{headings.map((heading, index) => <a key={index} href={`#${heading.id}`} className={`text-[13.5px] leading-snug text-muted-foreground transition hover:text-warm ${heading.level === 2 ? 'pl-6' : heading.level === 3 ? 'pl-9' : 'pl-3'}`}>{heading.text}</a>)}</div></nav>}{related.length > 0 && <div><p className="label mb-4">{t.more}</p><div className="flex flex-col gap-3">{related.map((item) => <Link key={item.id} href={localePath(locale, `/blog/${item.slug}`)} className="panel block overflow-hidden transition hover:border-line-2"><div className="pcard-media" style={{ aspectRatio: '16 / 7' }}><Cover src={item.coverImage} alt={item.title} fallback={(item.title || '?')[0].toUpperCase()} fallbackFontSize="1.5rem" /></div><div className="p-4"><p className="font-mono text-[10.5px] uppercase tracking-[.08em] text-dim">{formatDate(item.publishedAt, locale)}</p><p className="mt-2 text-[14px] font-medium leading-snug">{item.title}</p></div></Link>)}</div></div>}</div></aside></div>
  </div>;
}
