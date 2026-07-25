'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [status, setStatus] = useState('planning');
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => api.get('/projects?limit=50').then((r: any) => setProjects(r.data || []));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setTitle(''); setSlug(''); setDescription(''); setContent('');
    setCoverImage(''); setGithubUrl(''); setDemoUrl('');
    setStatus('planning'); setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, slug, description, content, coverImage, githubUrl, demoUrl, status };
    if (editingId) {
      await api.patch(`/projects/${editingId}`, data);
    } else {
      await api.post('/projects', data);
    }
    resetForm();
    load();
  };

  const editProject = async (project: any) => {
    setEditingId(project.id);
    setTitle(project.title); setSlug(project.slug);
    setDescription(project.description || ''); setContent(project.content || '');
    setCoverImage(project.coverImage || ''); setGithubUrl(project.githubUrl || '');
    setDemoUrl(project.demoUrl || ''); setStatus(project.status || 'planning');
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
        <div className="grid gap-3 md:grid-cols-2">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm" required />
          <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm" required />
        </div>
        <input placeholder="Cover image URL" value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm" />
        <div className="grid gap-3 md:grid-cols-2">
          <input placeholder="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm" />
          <input placeholder="Demo URL" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm" />
        </div>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm" rows={3} />
        <textarea placeholder="Content (markdown)" value={content} onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm" rows={4} />
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
            <div className="flex items-center gap-3">
              {p.coverImage && (
                <img src={p.coverImage} alt="" className="h-12 w-12 rounded object-cover" />
              )}
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.status?.replace('_', ' ')} · {p.slug}</p>
                {p.demoUrl && <p className="text-xs text-blue-500">🔗 {p.demoUrl}</p>}
              </div>
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
