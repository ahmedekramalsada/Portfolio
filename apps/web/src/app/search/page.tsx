'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface SearchResult {
  id: string; title: string; slug: string; type: string; excerpt?: string; rank: number;
}

interface Suggestion {
  text: string;
  type: string;
}

function typeHref(type: string) {
  if (type === 'post') return 'blog';
  if (type === 'project') return 'projects';
  return 'pages';
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (query.length >= 2) {
      api.get(`/search/suggestions?q=${query}`).then((data: unknown) => setSuggestions(data as Suggestion[])).catch(() => {});
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
    const res = (await api.get(`/search?q=${encodeURIComponent(query)}`)) as { data?: SearchResult[] };
    setResults(res.data || []);
  };

  return (
    <div className="page">
      <header className="mb-10">
        <span className="label">Search</span>
        <h1 className="h1 mt-5">Find anything on this site</h1>
        <p className="lede">Articles, projects and pages — searched by keyword.</p>
      </header>

      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, projects, pages…"
          className="field py-3.5 text-[16px]"
          autoFocus
        />
        {suggestions.length > 0 && query.length >= 2 && !searched && (
          <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-line bg-card shadow-2xl">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setQuery(s.text); handleSearch({ preventDefault: () => {} } as React.FormEvent); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] transition hover:bg-muted"
              >
                <span className="font-mono text-[10px] uppercase tracking-[.08em] text-dim">
                  {s.type === 'post' ? 'post' : 'page'}
                </span>
                {s.text}
              </button>
            ))}
          </div>
        )}
      </form>

      {searched && (
        <div className="mt-12">
          <p className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">
            {results.length} result{results.length !== 1 ? 's' : ''} for “{query}”
          </p>

          {results.length === 0 ? (
            <div className="panel mt-5 px-8 py-16 text-center">
              <p className="text-muted-foreground">No results found. Try a different search term.</p>
            </div>
          ) : (
            <div className="mt-5">
              {results.map((r) => (
                <a key={`${r.type}-${r.id}`} href={`/${typeHref(r.type)}/${r.slug}`} className="wrow group">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-[.08em] text-dim">{r.type}</span>
                    <p className="wtitle mt-1.5 text-[17px] font-medium transition-colors">{r.title}</p>
                    {r.excerpt && <p className="mt-2 line-clamp-1 text-[14px] text-muted-foreground">{r.excerpt}</p>}
                  </div>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-[.08em] text-warm">Open →</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
