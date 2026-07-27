'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const load = () => api.get('/projects?limit=50').then((r: any) => setProjects(r.data || []));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setTitle(''); setSlug(''); setDescription(''); setContent('');
    setCoverImage(''); setGithubUrl(''); setDemoUrl('');
    setStatus('planning'); setEditingId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:4000/api/v1/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.publicUrl) setCoverImage(data.publicUrl);
    } catch (err) {
      console.error('Upload failed', err);
    }
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const token = localStorage.getItem('accessToken');
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('http://localhost:4000/api/v1/media/upload', {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
        });
        const data = await res.json();
        if (data.id) {
          // If editing, associate with project
          if (editingId) {
            await api.patch(`/media/${data.id}`, { projectId: editingId });
          }
          setGallery(prev => [...prev, data]);
        }
      } catch {}
    }
    setUploading(false);
  };

  const removeGalleryItem = async (id: string) => {
    await api.delete(`/media/${id}`);
    setGallery(prev => prev.filter(m => m.id !== id));
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
    // Load gallery
    api.get('/media?projectId=' + project.id).then((data: any) => setGallery(data || [])).catch(() => setGallery([]));
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

      <form onSubmit={handleSubmit} className="mb-8 rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-lg">{editingId ? 'Edit Project' : 'New Project'}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input placeholder="project-slug" value={slug} onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8 hover:border-blue-500/50 transition-colors"
          >
            {coverImage ? (
              <div className="relative w-full">
                <img src={coverImage} alt="Cover" className="mx-auto max-h-48 rounded-lg object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <button type="button" onClick={(e) => { e.stopPropagation(); setCoverImage(''); }}
                  className="absolute top-2 right-2 rounded-full bg-red-500/90 px-2 py-1 text-xs text-white">Remove</button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-3xl mb-2">{uploading ? '⏳' : '📸'}</p>
                <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload image'}</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 10MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {/* Gallery */}
            <div>
            <label className="block text-sm font-medium mb-1">Gallery (images & videos)</label>
            <div onClick={() => galleryInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-6 hover:border-blue-500/50 transition-colors">
              <p className="text-3xl mb-2">📸</p>
              <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload multiple files'}</p>
              <p className="text-xs text-muted-foreground mt-1">Images & videos — you can select multiple</p>
              <input ref={galleryInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleGalleryUpload} />
            </div>
            {gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {gallery.map((item: any) => (
                  <div key={item.id} className="group relative rounded-lg overflow-hidden border">
                    {item.mimeType?.startsWith('video/') ? (
                      <video src={item.publicUrl} className="h-24 w-full object-cover" />
                    ) : (
                      <img src={item.publicUrl} alt="" className="h-24 w-full object-cover" />
                    )}
                    <button type="button" onClick={() => removeGalleryItem(item.id)}
                      className="absolute top-1 right-1 rounded-full bg-red-500/90 px-1.5 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  </div>
                ))}
              </div>
            )}
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL</label>
            <input placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Demo URL</label>
            <input placeholder="https://..." value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea placeholder="Brief description" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content (markdown)</label>
          <textarea placeholder="Full project content" value={content} onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" rows={5} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity">
              {editingId ? 'Update Project' : 'Create Project'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm hover:bg-accent transition-colors">Cancel</button>
            )}
          </div>
        </div>
      </form>

      {/* Project list */}
      <div className="space-y-3">
        {projects.map((p: any) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              {p.coverImage ? (
                <img src={p.coverImage} alt="" className="h-14 w-20 rounded-lg object-cover" />
              ) : (
                <div className="h-14 w-20 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
              )}
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.status?.replace('_', ' ')} · {p.slug}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editProject(p)} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-accent">Edit</button>
              <button onClick={() => deleteProject(p.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
