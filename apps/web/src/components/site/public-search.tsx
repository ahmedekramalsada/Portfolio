'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { api } from '@/services/api';
import { localePath, type Locale } from '@/lib/site-content';
import { projectCopy } from '@/lib/project-copy';

type SearchResult = { id: string; title: string; slug: string; type: 'post' | 'project'; excerpt?: string | null; rank?: number };

const copy = {
  en: { label: 'Search', title: 'Find anything on this site', lede: 'Articles and selected work — searched by keyword in English.', placeholder: 'Search articles and projects…', results: 'result', resultsPlural: 'results', noResults: 'No results found. Try a different search term.', clear: 'Clear search', post: 'Article', project: 'Project' },
  ar: { label: 'بحث', title: 'ابحث في الموقع', lede: 'ابحث في المقالات والأعمال المختارة — بالعربية أو بالإنجليزية.', placeholder: 'ابحث في المقالات والأعمال…', results: 'نتيجة', resultsPlural: 'نتائج', noResults: 'لا توجد نتائج. جرّب كلمة مختلفة.', clear: 'مسح البحث', post: 'مقال', project: 'مشروع' },
} as const;

export function PublicSearch({ locale, initialQuery = '' }: { locale: Locale; initialQuery?: string }) {
  const t = copy[locale];
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(Boolean(initialQuery));
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2 || cleanQuery === initialQuery.trim()) return;
    const timer = setTimeout(() => void fetchResults(cleanQuery), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, query]);

  const runSearch = async (event?: FormEvent) => {
    event?.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    await fetchResults(cleanQuery);
  };

  const fetchResults = async (cleanQuery: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setSearched(true);
    try {
      const params = `q=${encodeURIComponent(cleanQuery)}&lang=${locale}`;
      const response = await api.get<{ data?: SearchResult[] }>(`/search?${params}`, { signal: controller.signal });
      setResults([...(response.data || [])].sort((a, b) => (b.rank || 0) - (a.rank || 0)));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setResults([]);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  };

  useEffect(() => {
    const cleanQuery = initialQuery.trim();
    if (cleanQuery) void fetchResults(cleanQuery);
  }, [initialQuery]);

  const hrefFor = (result: SearchResult) => localePath(locale, result.type === 'post' ? `/blog/${result.slug}` : `/projects/${result.slug}`);
  const titleFor = (result: SearchResult) => result.type === 'project' ? (projectCopy(locale, result.slug)?.title || result.title) : result.title;
  const excerptFor = (result: SearchResult) => result.type === 'project' ? (projectCopy(locale, result.slug)?.result || result.excerpt) : result.excerpt;

  return (
    <div className="page" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className="mb-10">
        <span className="label">{t.label}</span>
        <h1 className="h1 mt-5">{t.title}</h1>
        <p className="lede">{t.lede}</p>
      </header>
      <form onSubmit={runSearch} className="relative max-w-2xl">
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.placeholder} className="field py-3.5 text-[16px]" autoComplete="off" />
        <button type="submit" className="btn-primary mt-3" disabled={loading}>{loading ? (locale === 'ar' ? 'جارٍ البحث…' : 'Searching…') : (locale === 'ar' ? 'ابحث' : 'Search')} <span aria-hidden>→</span></button>
      </form>
      {searched && <div className="mt-12"><p className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">{results.length} {results.length === 1 ? t.results : t.resultsPlural} {locale === 'ar' ? 'عن' : 'for'} “{query.trim()}”</p>{results.length === 0 ? <div className="panel mt-5 px-8 py-16 text-center"><p className="text-muted-foreground">{t.noResults}</p></div> : <div className="mt-5">{results.map((result) => <a key={`${result.type}-${result.id}`} href={hrefFor(result)} className="wrow group"><div className="min-w-0"><span className="font-mono text-[10px] uppercase tracking-[.08em] text-dim">{result.type === 'post' ? t.post : t.project}</span><p className="wtitle mt-1.5 text-[17px] font-medium transition-colors">{titleFor(result)}</p>{excerptFor(result) && <p className="mt-2 line-clamp-1 text-[14px] text-muted-foreground">{excerptFor(result)}</p>}</div><span className="shrink-0 font-mono text-[11px] uppercase tracking-[.08em] text-warm">{locale === 'ar' ? 'افتح' : 'Open'} →</span></a>)}</div>}</div>}
    </div>
  );
}
