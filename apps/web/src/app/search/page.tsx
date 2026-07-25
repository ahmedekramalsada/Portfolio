'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface SearchResult {
  id: string; title: string; slug: string; type: string; excerpt?: string; rank: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (query.length >= 2) {
      api.get(`/search/suggestions?q=${query}`).then((data: any) => setSuggestions(data)).catch(() => {});
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
    const res: any = await api.get(`/search?q=${encodeURIComponent(query)}`);
    setResults(res.data || []);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>

      <form onSubmit={handleSearch} className="relative mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, projects, pages..."
          className="w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
        {suggestions.length > 0 && query.length >= 2 && !searched && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border bg-background shadow-lg">
            {suggestions.map((s: any, i: number) => (
              <button
                key={i}
                onClick={() => { setQuery(s.text); handleSearch({ preventDefault: () => {} } as any); }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
              >
                <span className="text-muted-foreground">{s.type === 'post' ? '📝' : '📁'}</span>
                {s.text}
              </button>
            ))}
          </div>
        )}
      </form>

      {searched && (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>

          {results.length === 0 ? (
            <p className="text-muted-foreground">No results found. Try a different search term.</p>
          ) : (
            <div className="space-y-4">
              {results.map((r) => (
                <a
                  key={`${r.type}-${r.id}`}
                  href={`/${r.type === 'post' ? 'blog' : r.type === 'project' ? 'projects' : 'pages'}/${r.slug}`}
                  className="block rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs rounded-full bg-muted px-2 py-0.5">{r.type}</span>
                  </div>
                  <p className="font-medium">{r.title}</p>
                  {r.excerpt && <p className="text-sm text-muted-foreground mt-1">{r.excerpt}</p>}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
