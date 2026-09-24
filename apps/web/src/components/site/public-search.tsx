'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/services/api';
import { localePath, type Locale } from '@/lib/site-content';
import { projectCopy } from '@/lib/project-copy';

type SearchResult = { id: string; title: string; slug: string; type: 'post' | 'project'; excerpt?: string | null; rank?: number };
type Suggestion = { text: string; type: 'post' | 'project'; slug: string };

const copy = {
  en: { label: 'Search', title: 'Find anything on this site', lede: 'Articles and selected work — searched by keyword in English.', placeholder: 'Search articles and projects…', results: 'result', resultsPlural: 'results', noResults: 'No results found. Try a different search term.', clear: 'Clear search', post: 'Article', project: 'Project' },
  ar: { label: 'بحث', title: 'ابحث في الموقع', lede: 'ابحث عن المقالات والأعمال المختورة — بالعربية.', placeholder: 'ابحث في المقالات والأعمال…', results: 'نتيجة', resultsPlural: 'نتائج', noResults: 'لا توجد نتائج. جرّب كلمة أخرى.', clear: 'مسح البحث', post: 'مقال', project: 'مشروع' },
} as const;

export function PublicSearch({ locale, initialQuery = '' }: { locale: Locale; initialQuery?: string }) {
  const t = copy[locale];
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(Boolean(initialQuery));
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    api.get<unknown>(`/search/suggestions?q=${encodeURIComponent(query.trim())}&lang=${locale}`)
      .then((data) => setSuggestions((data || []) as Suggestion[]))
      .catch(() => setSuggestions([]));
  }, [locale, query]);

  const runSearch = async (event?: FormEvent) => {
    event?.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    await fetchResults(cleanQuery);
  };

  const runSearchFor = async (cleanQuery: string) => {
    const nextQuery = cleanQuery.trim();
    if (!nextQuery) return;
    await fetchResults(nextQuery);
  };

  const fetchResults = async (cleanQuery: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = `q=${encodeURIComponent(cleanQuery)}&lang=${locale}`;
      const [posts, projects] = await Promise.all([
        api.get<{ data?: SearchResult[] }>(`/search?${params}&type=posts`),
        api.get<{ data?: SearchResult[] }>(`/search?${params}&type=projects`),
      ]);
      setResults([...(posts.data || []), ...(projects.data || [])].sort((a, b) => (b.rank || 0) - (a.rank || 0)));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
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
        {suggestions.length > 0 && query.trim().length >= 2 && !searched && (
          <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-line bg-card shadow-2xl">
            {suggestions.map((suggestion) => <button key={`${suggestion.type}-${suggestion.slug}`} type="button" onClick={() => { setQuery(suggestion.text); setSuggestions([]); void runSearchFor(suggestion.text); }} className="flex min-h-[44px] w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] transition hover:bg-muted"><span className="font-mono text-[10px] uppercase tracking-[.08em] text-dim">{suggestion.type === 'post' ? t.post : t.project}</span>{suggestion.text}</button>)}
          </div>
        )}
        <button type="submit" className="btn-primary mt-3" disabled={loading}>{loading ? (locale === 'ar' ? 'جارٍ البحث…' : 'Searching…') : (locale === 'ar' ? 'ابحث' : 'Search')} <span aria-hidden>→</span></button>
      </form>
      {searched && <div className="mt-12"><p className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">{results.length} {results.length === 1 ? t.results : t.resultsPlural} {locale === 'ar' ? 'عن' : 'for'} “{query.trim()}”</p>{results.length === 0 ? <div className="panel mt-5 px-8 py-16 text-center"><p className="text-muted-foreground">{t.noResults}</p></div> : <div className="mt-5">{results.map((result) => <a key={`${result.type}-${result.id}`} href={hrefFor(result)} className="wrow group"><div className="min-w-0"><span className="font-mono text-[10px] uppercase tracking-[.08em] text-dim">{result.type === 'post' ? t.post : t.project}</span><p className="wtitle mt-1.5 text-[17px] font-medium transition-colors">{titleFor(result)}</p>{excerptFor(result) && <p className="mt-2 line-clamp-1 text-[14px] text-muted-foreground">{excerptFor(result)}</p>}</div><span className="shrink-0 font-mono text-[11px] uppercase tracking-[.08em] text-warm">{locale === 'ar' ? 'افتح' : 'Open'} →</span></a>)}</div>}</div>}
    </div>
  );
}
