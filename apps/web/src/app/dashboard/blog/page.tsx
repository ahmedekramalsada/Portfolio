'use client';

import { useEffect, useState, useRef } from 'react';
import { api, API_BASE_URL } from '@/services/api';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get('/posts?limit=50').then((r: any) => setPosts(r.data || []));
  useEffect(() => { load(); }, []);

  const reset = () => { setTitle(''); setSlug(''); setContent(''); setExcerpt(''); setCoverImage(''); setLanguage('en'); setEditingId(null); };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/media/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.publicUrl) setCoverImage(data.publicUrl);
    } catch {}
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { title, slug, content, excerpt, coverImage, language };
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
      setLanguage(full.language === 'ar' ? 'ar' : 'en');
    } catch {
      setContent(post.content || '');
    }
  };

  const publish = async (id: string) => { await api.post(`/posts/${id}/publish`); load(); };
  const remove = async (id: string) => { if (confirm('Delete?')) { await api.delete(`/posts/${id}`); load(); } };

  return (
    <div>
      <h1 className="h2 mb-6">Blog Posts</h1>

      <form onSubmit={submit} className="panel mb-8 space-y-4 p-6">
        <h2 className="text-lg font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="field" required />
          <input placeholder="slug-post-title" value={slug} onChange={(e) => setSlug(e.target.value)}
            className="field" required />
        </div>
        <div>
          <label className="label-field" htmlFor="post-language">Article language</label>
          <select id="post-language" value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')} className="field">
            <option value="en">English — /blog/</option>
            <option value="ar">العربية — /ar/blog/</option>
          </select>
        </div>

        {/* Image upload */}
        <div>
          <label className="label-field">Cover Image</label>
          <div onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-line-2 bg-muted/40 p-8 transition-colors hover:border-warm/40">
            {coverImage ? (
              <div className="relative w-full">
                <img src={coverImage} alt="" className="mx-auto max-h-48 rounded-[10px] object-cover" />
                <button type="button" onClick={(e) => { e.stopPropagation(); setCoverImage(''); }}
                  className="absolute top-2 right-2 rounded-full border border-line-2 bg-background/90 px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground">Remove</button>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-2 text-3xl">{uploading ? '⏳' : '📸'}</p>
                <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload cover image'}</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>
        </div>

        <input placeholder="Excerpt (short description)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
          className="field" />
        <textarea placeholder="Content (markdown)" value={content} onChange={(e) => setContent(e.target.value)}
          className="field" rows={8} />
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && <button type="button" onClick={reset} className="btn-ghost">Cancel</button>}
        </div>
      </form>

      <div className="space-y-2">
        {posts.map((post: any) => (
          <div key={post.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex min-w-0 items-center gap-3">
              {post.coverImage && <img src={post.coverImage} alt="" className="h-12 w-20 rounded-[10px] object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
              <div className="min-w-0">
                <p className="truncate font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.slug} · {post.status}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              {post.status !== 'published' && (
                <button onClick={() => publish(post.id)} className="rounded-[10px] border border-ok/35 bg-ok/10 px-3 py-1.5 text-xs font-medium text-ok transition-colors hover:bg-ok/20">Publish</button>
              )}
              <button onClick={() => edit(post)} className="rounded-[10px] border border-line-2 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => remove(post.id)} className="rounded-[10px] border border-line-2 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
