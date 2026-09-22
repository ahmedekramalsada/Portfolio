'use client';

import { useEffect, useState, useRef } from 'react';
import { api, API_BASE_URL } from '@/services/api';

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
      const res = await fetch(`${API_BASE_URL}/media/upload`, {
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
        const res = await fetch(`${API_BASE_URL}/media/upload`, {
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
      <h1 className="h2 mb-6">Projects</h1>

      <form onSubmit={handleSubmit} className="panel mb-8 space-y-4 p-6">
        <h2 className="text-lg font-semibold">{editingId ? 'Edit Project' : 'New Project'}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-field">Title</label>
            <input placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="field" required />
          </div>
          <div>
            <label className="label-field">Slug</label>
            <input placeholder="project-slug" value={slug} onChange={(e) => setSlug(e.target.value)}
              className="field" required />
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="label-field">Cover Image</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative flex cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-line-2 bg-muted/40 p-8 transition-colors hover:border-warm/40"
          >
            {coverImage ? (
              <div className="relative w-full">
                <img src={coverImage} alt="Cover" className="mx-auto max-h-48 rounded-[10px] object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <button type="button" onClick={(e) => { e.stopPropagation(); setCoverImage(''); }}
                  className="absolute top-2 right-2 rounded-full border border-line-2 bg-background/90 px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground">Remove</button>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-2 text-3xl">{uploading ? '⏳' : '📸'}</p>
                <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload image'}</p>
                <p className="mt-1 text-xs text-dim">PNG, JPG, WebP up to 10MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {/* Gallery */}
            <div>
            <label className="label-field">Gallery (images & videos)</label>
            <div onClick={() => galleryInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-line-2 bg-muted/40 p-6 transition-colors hover:border-warm/40">
              <p className="mb-2 text-3xl">📸</p>
              <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload multiple files'}</p>
              <p className="mt-1 text-xs text-dim">Images & videos — you can select multiple</p>
              <input ref={galleryInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleGalleryUpload} />
            </div>
            {gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gallery.map((item: any) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-[12px] border border-line">
                    {item.mimeType?.startsWith('video/') ? (
                      <video src={item.publicUrl} className="h-24 w-full object-cover" />
                    ) : (
                      <img src={item.publicUrl} alt="" className="h-24 w-full object-cover" />
                    )}
                    <button type="button" onClick={() => removeGalleryItem(item.id)}
                      className="absolute top-1 right-1 rounded-full border border-line-2 bg-background/90 px-1.5 py-0.5 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">✕</button>
                  </div>
                ))}
              </div>
            )}
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-field">GitHub URL</label>
            <input placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
              className="field" />
          </div>
          <div>
            <label className="label-field">Demo URL</label>
            <input placeholder="https://..." value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)}
              className="field" />
          </div>
        </div>

        <div>
          <label className="label-field">Description</label>
          <textarea placeholder="Brief description" value={description} onChange={(e) => setDescription(e.target.value)}
            className="field" rows={3} />
        </div>

        <div>
          <label className="label-field">Content (markdown)</label>
          <textarea placeholder="Full project content" value={content} onChange={(e) => setContent(e.target.value)}
            className="field" rows={5} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-field">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="field">
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Project' : 'Create Project'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
            )}
          </div>
        </div>
      </form>

      {/* Project list */}
      <div className="space-y-3">
        {projects.map((p: any) => (
          <div key={p.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex min-w-0 items-center gap-4">
              {p.coverImage ? (
                <img src={p.coverImage} alt="" className="h-14 w-20 rounded-[10px] object-cover" />
              ) : (
                <div className="h-14 w-20 rounded-[10px] border border-line bg-muted" />
              )}
              <div className="min-w-0">
                <p className="truncate font-medium">{p.title}</p>
                <p className="truncate text-xs text-muted-foreground">{p.status?.replace('_', ' ')} · {p.slug}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => editProject(p)} className="rounded-[10px] border border-line-2 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => deleteProject(p.id)} className="rounded-[10px] border border-line-2 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
