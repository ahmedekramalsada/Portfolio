'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/services/api';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get('/posts?limit=50').then((r: any) => setPosts(r.data || []));
  useEffect(() => { load(); }, []);

  const reset = () => { setTitle(''); setSlug(''); setContent(''); setExcerpt(''); setCoverImage(''); setEditingId(null); };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:4000/api/v1/media/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.publicUrl) setCoverImage(data.publicUrl);
    } catch {}
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { title, slug, content, excerpt, coverImage };
    if (editingId) {
      await api.patch(`/posts/${editingId}`, data);
    } else {
      await api.post('/posts', data);
    }
    reset();
    load();
  };

  const edit = async (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    try {
      const full: any = await api.get(`/posts/${post.slug}`);
      setContent(full.content || '');
      setExcerpt(full.excerpt || '');
      setCoverImage(full.coverImage || '');
    } catch {
      setContent(post.content || '');
    }
  };

  const publish = async (id: string) => { await api.post(`/posts/${id}/publish`); load(); };
  const remove = async (id: string) => { if (confirm('Delete?')) { await api.delete(`/posts/${id}`); load(); } };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Blog Posts</h1>

      <form onSubmit={submit} className="mb-8 rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-lg">{editingId ? 'Edit Post' : 'New Post'}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm" required />
          <input placeholder="slug-post-title" value={slug} onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm" required />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <div onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8 hover:border-blue-500/50 transition-colors">
            {coverImage ? (
              <div className="relative w-full">
                <img src={coverImage} alt="" className="mx-auto max-h-48 rounded-lg object-cover" />
                <button type="button" onClick={(e) => { e.stopPropagation(); setCoverImage(''); }}
                  className="absolute top-2 right-2 rounded-full bg-red-500/90 px-2 py-1 text-xs text-white">Remove</button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-3xl mb-2">{uploading ? '⏳' : '📸'}</p>
                <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload cover image'}</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>
        </div>

        <input placeholder="Excerpt (short description)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
        <textarea placeholder="Content (markdown)" value={content} onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm" rows={8} />
        <div className="flex gap-2">
          <button type="submit" className="rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background hover:opacity-90">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && <button type="button" onClick={reset} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>}
        </div>
      </form>

      <div className="space-y-2">
        {posts.map((post: any) => (
          <div key={post.id} className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              {post.coverImage && <img src={post.coverImage} alt="" className="h-12 w-20 rounded-lg object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.slug} · {post.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {post.status !== 'published' && (
                <button onClick={() => publish(post.id)} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700">Publish</button>
              )}
              <button onClick={() => edit(post)} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-accent">Edit</button>
              <button onClick={() => remove(post.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
