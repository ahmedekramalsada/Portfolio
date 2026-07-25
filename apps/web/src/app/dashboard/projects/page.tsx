'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('planning');
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => api.get('/projects?limit=50').then((r: any) => setProjects(r.data || []));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setTitle(''); setSlug(''); setDescription(''); setStatus('planning'); setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const data: any = { title, slug, description, status };
      await api.patch(`/projects/${editingId}`, data);
    } else {
      await api.post('/projects', { title, slug, description, status });
    }
    resetForm();
    load();
  };

  const editProject = async (project: any) => {
    setEditingId(project.id);
    setTitle(project.title);
    setSlug(project.slug);
    setDescription(project.description || '');
    setStatus(project.status || 'planning');
  };

  const deleteProject = async (id: string) => {
    if (confirm('Delete this project?')) {
      await api.delete(`/projects/${id}`);
      load();
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Projects</h1>

      <form onSubmit={handleSubmit} className="mb-8 rounded-lg border p-4 space-y-3">
        <h2 className="font-semibold">{editingId ? 'Edit Project' : 'New Project'}</h2>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm w-full" required />
        <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm w-full" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm w-full" rows={3} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm w-full">
          <option value="planning">Planning</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {projects.map((p: any) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.status?.replace('_', ' ')} · {p.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editProject(p)} className="rounded-md border px-3 py-1 text-xs">Edit</button>
              <button onClick={() => deleteProject(p.id)} className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
