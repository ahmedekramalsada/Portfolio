import Link from 'next/link';
import { Cover } from '@/components/site/cover';
import { PageHeader } from '@/components/site/page-header';
import { JsonLd } from '@/components/site/json-ld';
import { TiltCard } from '@/components/site/tilt-card';
import { localePath, type Locale } from '@/lib/site-content';
import { formatDate, getCategories, getPosts } from '@/lib/public-content';

const copy = {
  en: { label: 'Writing', title: 'Latest writing', lede: 'DevOps, cloud infrastructure, platform engineering, and practical AI systems — written from the decisions behind the work.', search: 'Search articles…', clear: 'clear', all: 'All', empty: 'No articles found', viewAll: 'View all articles', featured: 'Featured', read: 'Read', min: 'min read', startHere: 'Start here', topics: 'Topics', result: 'results for', results: 'results' },
  ar: { label: 'الكتابة', title: 'أحدث الكتابة', lede: 'DevOps والبنية التحتية السحابية وهندسة المنصات وأنظمة الذكاء الاصطناعي العملية — من القرارات التي تقف خلف العمل.', search: 'ابحث في المقالات…', clear: 'مسح', all: 'كل المقالات', empty: 'لا توجد مقالات', viewAll: 'شاهد كل المقالات', featured: 'مقال مختار', read: 'اقرأ', min: 'دقيقة قراءة', startHere: 'ابدأ من هنا', topics: 'المواضيع', result: 'نتائج البحث عن', results: 'نتيجة' },
} as const;

export async function PublicBlog({ locale, searchParams }: { locale: Locale; searchParams: { page?: string; category?: string; q?: string } }) {
  const t = copy[locale];
  const page = Number(searchParams.page) || 1;
  const category = searchParams.category || 'all';
  const query = (searchParams.q || '').trim();
  const { data: allPosts, meta } = await getPosts({ locale, category, page, limit: 20 });
  const categories = await getCategories();
  const posts = query ? allPosts.filter((post) => `${post.title} ${post.excerpt || ''}`.toLowerCase().includes(query.toLowerCase())) : allPosts;
  const topicCats = categories.filter((item) => ['DevOps', 'Docker', 'Kubernetes', 'Linux', 'AI', 'Tutorials', 'Career', 'Monitoring', 'Cloud', 'Backend', 'Frontend'].includes(item.name));
  const hrefFor = (params: string) => localePath(locale, `/blog${params}`);

  return (
    <div className="page page-wide" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': ['Blog', 'CollectionPage'], url: `https://ahmedekram.site${hrefFor('')}`, inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US', name: t.title, description: t.lede, mainEntity: { '@type': 'ItemList', itemListElement: posts.map((post, index) => ({ '@type': 'ListItem', position: index + 1, url: `https://ahmedekram.site${hrefFor(`/${post.slug}`)}`, name: post.title })) } }} />
      <PageHeader label={t.label} title={t.title} lede={t.lede} />
      <form method="GET" action={hrefFor('')} className="mb-6"><div className="relative max-w-md"><svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg><input name="q" type="search" placeholder={t.search} defaultValue={query} className="field pl-10" /></div></form>
      {query ? <p className="mb-10 font-mono text-[11px] uppercase tracking-[.09em] text-dim">{posts.length} {posts.length === 1 ? t.results : t.results} {t.result} “{query}” · <Link href={hrefFor('')} className="text-warm hover:underline">{t.clear}</Link></p> : <div className="mb-10 flex flex-wrap gap-2"><Link href={hrefFor('')} className={`chip ${category === 'all' ? 'chip-on' : ''}`}>{t.all}</Link>{topicCats.map((item) => <Link key={item.id} href={hrefFor(`?category=${item.slug}`)} className={`chip ${category === item.slug ? 'chip-on' : ''}`}>{item.name}</Link>)}</div>}
      {posts.length === 0 ? <div className="panel px-8 py-20 text-center"><p className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">Empty</p><p className="mt-3 text-muted-foreground">{t.empty}{query ? ` “${query}”` : ''}.</p><Link href={hrefFor('')} className="mt-4 inline-flex min-h-[40px] items-center text-[14px] text-warm hover:underline">{t.viewAll} →</Link></div> : <div className="grid gap-6 md:grid-cols-2">{posts.map((post, index) => { const featured = index === 0 && posts.length > 1; return <Link key={post.id} href={hrefFor(`/${post.slug}`)} className={`pcard ${featured ? 'pcard-wide md:col-span-2' : ''}`}><div className="pcard-media"><Cover src={post.coverImage} alt={post.title} fallback={(post.title || '?')[0].toUpperCase()} /></div><div className={`pcard-body ${featured ? 'md:justify-center md:p-9' : ''}`}><div className="flex flex-wrap items-center gap-2">{post.category && <span className="chip chip-on">{post.category.name}</span>}{post.publishedAt && <span className="chip">{formatDate(post.publishedAt, locale)}</span>}</div><h2 className={`pcard-title ${featured ? 'md:text-[28px]' : ''}`}>{post.title}</h2>{post.excerpt && <p className={`pcard-excerpt ${featured ? 'md:line-clamp-3' : 'line-clamp-2'}`}>{post.excerpt}</p>}<div className="pcard-foot"><span className="font-mono text-[10.5px] uppercase tracking-[.09em] text-dim">{post.readingTime || 5} {t.min}</span><span className="font-mono text-[11px] uppercase tracking-[.08em] text-warm">{t.read} →</span></div></div></Link>; })}</div>}
      {meta.totalPages > 1 && !query && <div className="mt-12 flex items-center justify-center gap-6">{page > 1 && <Link href={hrefFor(`?page=${page - 1}${category !== 'all' ? `&category=${category}` : ''}`)} className="btn-ghost">← {locale === 'ar' ? 'السابق' : 'Previous'}</Link>}<span className="font-mono text-[11.5px] uppercase tracking-[.08em] text-dim">{locale === 'ar' ? 'صفحة' : 'Page'} {page} {locale === 'ar' ? 'من' : 'of'} {meta.totalPages}</span>{page < meta.totalPages && <Link href={hrefFor(`?page=${page + 1}${category !== 'all' ? `&category=${category}` : ''}`)} className="btn-ghost">{locale === 'ar' ? 'التالي' : 'Next'} →</Link>}</div>}
    </div>
  );
}
