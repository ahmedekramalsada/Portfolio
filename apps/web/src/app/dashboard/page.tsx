'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { api } from '@/services/api';

interface Stats {
  posts: number;
  projects: number;
  categories: number;
  skills: number;
}

function DashboardContent() {
  const [stats, setStats] = useState<Stats>({ posts: 0, projects: 0, categories: 0, skills: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/posts?limit=1').catch(() => ({ data: [], meta: { total: 0 } })),
      api.get('/projects?limit=1').catch(() => ({ data: [], meta: { total: 0 } })),
      api.get('/categories').catch(() => []),
      api.get('/skills').catch(() => []),
    ]).then(([posts, projects, categories, skills]) => {
      setStats({
        posts: posts?.meta?.total || 0,
        projects: projects?.meta?.total || 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        skills: Array.isArray(skills) ? skills.length : 0,
      });
    });
  }, []);

  const widgets = [
    { label: 'Blog Posts', value: stats.posts, href: '/dashboard/blog' },
    { label: 'Projects', value: stats.projects, href: '/dashboard/projects' },
    { label: 'Categories', value: stats.categories, href: '/dashboard/categories' },
    { label: 'Skills', value: stats.skills, href: '/dashboard/settings' },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {widgets.map((w) => (
          <a key={w.label} href={w.href} className="rounded-lg border p-6 transition-colors hover:bg-accent">
            <p className="text-3xl font-bold">{w.value}</p>
            <p className="text-sm text-muted-foreground">{w.label}</p>
          </a>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Quick Links</h2>
          <div className="space-y-2 text-sm">
            <a href="/dashboard/blog" className="block rounded-md px-3 py-2 hover:bg-accent">📝 Create new blog post</a>
            <a href="/dashboard/projects" className="block rounded-md px-3 py-2 hover:bg-accent">📁 Add new project</a>
            <a href="/dashboard/categories" className="block rounded-md px-3 py-2 hover:bg-accent">🏷 Manage categories</a>
            <a href="/dashboard/media" className="block rounded-md px-3 py-2 hover:bg-accent">🖼 Upload media</a>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">System</h2>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>App: Ahmed OS v0.1.0</p>
            <p>API: http://localhost:4000</p>
            <p>Frontend: http://localhost:3000</p>
            <p>Database: PostgreSQL 17</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
