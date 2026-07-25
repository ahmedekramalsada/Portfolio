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
      <h1 className="mb-6 text-2xl font-bold">Categories & Tags</h1>

      <form onSubmit={handleSubmit} className="mb-8 rounded-lg border p-4 space-y-3 max-w-md">
        <h2 className="font-semibold">{editing ? 'Edit' : 'New'} Category</h2>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-md border px-3 py-2 text-sm w-full" required />
        <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-md border px-3 py-2 text-sm w-full" required />
        <div className="flex gap-2">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setName(''); setSlug(''); }} className="rounded-md border px-4 py-2 text-sm">Cancel</button>}
        </div>
      </form>

      <div className="grid gap-2 md:grid-cols-3">
        {categories.map((c: any) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.slug}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(c.id); setName(c.name); setSlug(c.slug); }} className="rounded-md border px-2 py-1 text-xs">Edit</button>
              <button onClick={() => deleteCat(c.id)} className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
