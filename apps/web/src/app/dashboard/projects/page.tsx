'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const load = () => api.get('/projects?limit=50').then((r: any) => setProjects(r.data || []));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/projects', { title, slug, description });
    setTitle(''); setSlug(''); setDescription('');
    load();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Projects</h1>

      <form onSubmit={handleSubmit} className="mb-8 rounded-lg border p-4 space-y-3">
        <h2 className="font-semibold">New Project</h2>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-md border px-3 py-2 text-sm w-full" required />
        <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-md border px-3 py-2 text-sm w-full" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-md border px-3 py-2 text-sm w-full" rows={3} />
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Create</button>
      </form>

      <div className="space-y-2">
        {projects.map((p: any) => (
          <div key={p.id} className="rounded-lg border p-4">
            <p className="font-medium">{p.title}</p>
            <p className="text-xs text-muted-foreground">{p.status} · {p.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
