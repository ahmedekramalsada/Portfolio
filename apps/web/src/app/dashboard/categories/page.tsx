'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => api.get('/categories').then((data: any) => setCategories(data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await api.patch(`/categories/${editing}`, { name, slug });
    } else {
      await api.post('/categories', { name, slug });
    }
    setName(''); setSlug(''); setEditing(null);
    load();
  };

  const deleteCat = async (id: string) => {
    if (confirm('Delete?')) { await api.delete(`/categories/${id}`); load(); }
  };

  return (
    <div>
      <h1 className="h2 mb-6">Categories & Tags</h1>

      <form onSubmit={handleSubmit} className="panel mb-8 max-w-md space-y-3 p-4">
        <h2 className="font-semibold">{editing ? 'Edit' : 'New'} Category</h2>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="field" required />
        <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="field" required />
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setName(''); setSlug(''); }} className="btn-ghost">Cancel</button>}
        </div>
      </form>

      <div className="grid gap-3 md:grid-cols-3">
        {categories.map((c: any) => (
          <div key={c.id} className="panel flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">{c.slug}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => { setEditing(c.id); setName(c.name); setSlug(c.slug); }} className="rounded-[10px] border border-line-2 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => deleteCat(c.id)} className="rounded-[10px] border border-line-2 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
