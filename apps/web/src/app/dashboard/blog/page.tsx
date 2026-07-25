'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  category?: { name: string };
  publishedAt?: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadPosts = () => {
    api.get('/posts?limit=50').then((res: any) => setPosts(res.data || []));
  };

  useEffect(() => { loadPosts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/posts/${editingId}`, { title, slug, content });
    } else {
      await api.post('/posts', { title, slug, content });
    }
    setTitle(''); setSlug(''); setContent(''); setEditingId(null);
    loadPosts();
  };

  const editPost = (post: Post) => {
    setTitle(post.title); setSlug(post.slug); setEditingId(post.id);
  };

  const publishPost = async (id: string) => {
    await api.post(`/posts/${id}/publish`);
    loadPosts();
  };

  const deletePost = async (id: string) => {
    if (confirm('Delete this post?')) {
      await api.delete(`/posts/${id}`);
      loadPosts();
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Blog Posts</h1>

      <form onSubmit={handleSubmit} className="mb-8 rounded-lg border p-4 space-y-3">
        <h2 className="font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm" required />
          <input placeholder="slug-post-title" value={slug} onChange={(e) => setSlug(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm" required />
        </div>
        <textarea placeholder="Content (markdown)" value={content} onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm" rows={4} />
        <div className="flex gap-2">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setTitle(''); setSlug(''); setContent(''); }}
              className="rounded-md border px-4 py-2 text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-muted-foreground">{post.slug} · {post.status}{post.category ? ` · ${post.category.name}` : ''}</p>
            </div>
            <div className="flex gap-2">
              {post.status !== 'published' && (
                <button onClick={() => publishPost(post.id)} className="rounded-md bg-green-600 px-3 py-1 text-xs text-white">Publish</button>
              )}
              <button onClick={() => editPost(post)} className="rounded-md border px-3 py-1 text-xs">Edit</button>
              <button onClick={() => deletePost(post.id)} className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
