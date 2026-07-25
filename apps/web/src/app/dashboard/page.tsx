'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { api } from '@/services/api';
import Link from 'next/link';

function DashboardContent() {
  const [stats, setStats] = useState<any>({ posts: 0, projects: 0, categories: 0, skills: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/posts?limit=5').catch(() => ({ data: [], meta: { total: 0 } })),
      api.get('/projects?limit=5').catch(() => ({ data: [], meta: { total: 0 } })),
      api.get('/categories').catch(() => []),
      api.get('/skills').catch(() => []),
    ]).then(([posts, projects, categories, skills]) => {
      setStats({
        posts: (posts as any)?.meta?.total || 0,
        projects: (projects as any)?.meta?.total || 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        skills: Array.isArray(skills) ? skills.length : 0,
      });
      setRecentPosts((posts as any)?.data?.slice(0, 5) || []);
      setRecentProjects((projects as any)?.data?.slice(0, 5) || []);
    });
  }, []);

  const widgets = [
    { label: 'Blog Posts', value: stats.posts, href: '/dashboard/blog', color: 'from-blue-500 to-blue-600' },
    { label: 'Projects', value: stats.projects, href: '/dashboard/projects', color: 'from-purple-500 to-purple-600' },
    { label: 'Categories', value: stats.categories, href: '/dashboard/categories', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Skills', value: stats.skills, href: '/dashboard/settings', color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {widgets.map((w) => (
          <Link key={w.label} href={w.href}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className={`absolute inset-0 bg-gradient-to-br ${w.color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
            <p className="text-3xl font-bold">{w.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{w.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Posts */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
            <h2 className="font-semibold">Recent Posts</h2>
            <Link href="/dashboard/blog" className="text-xs text-blue-500 hover:text-blue-400">View all</Link>
          </div>
          <div className="divide-y divide-border/40">
            {recentPosts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground text-center">No posts yet</p>
            ) : recentPosts.map((post: any) => (
              <div key={post.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.status}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  post.status === 'published' ? 'bg-green-500/10 text-green-500' :
                  post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-muted text-muted-foreground'
                }`}>{post.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
            <h2 className="font-semibold">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-xs text-blue-500 hover:text-blue-400">View all</Link>
          </div>
          <div className="divide-y divide-border/40">
            {recentProjects.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground text-center">No projects yet</p>
            ) : recentProjects.map((project: any) => (
              <div key={project.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt="" className="h-8 w-8 rounded object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500/20 to-purple-600/20" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.status?.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/blog" className="rounded-lg border px-4 py-2 text-sm hover:bg-accent transition-colors">
            📝 New Blog Post
          </Link>
          <Link href="/dashboard/projects" className="rounded-lg border px-4 py-2 text-sm hover:bg-accent transition-colors">
            📁 New Project
          </Link>
          <Link href="/dashboard/media" className="rounded-lg border px-4 py-2 text-sm hover:bg-accent transition-colors">
            🖼 Upload Media
          </Link>
          <Link href="/dashboard/categories" className="rounded-lg border px-4 py-2 text-sm hover:bg-accent transition-colors">
            🏷 Manage Categories
          </Link>
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
