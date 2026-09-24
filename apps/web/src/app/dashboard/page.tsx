'use client';

import { useEffect, useState } from 'react';
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
    { label: 'Blog Posts', value: stats.posts, href: '/dashboard/blog' },
    { label: 'Projects', value: stats.projects, href: '/dashboard/projects' },
    { label: 'Categories', value: stats.categories, href: '/dashboard/categories' },
    { label: 'Skills', value: stats.skills, href: '/dashboard/skills' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="h2">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {widgets.map((w) => (
          <Link key={w.label} href={w.href} className="panel p-5">
            <p className="text-3xl font-semibold tracking-[-.03em]">{w.value}</p>
            <p className="label mt-2">{w.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Posts */}
        <div className="panel">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-semibold">Recent Posts</h2>
            <Link href="/dashboard/blog" className="text-xs text-warm transition-colors hover:text-foreground">View all</Link>
          </div>
          <div className="divide-y divide-line">
            {recentPosts.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">No posts yet</p>
            ) : recentPosts.map((post: any) => (
              <div key={post.id} className="flex items-center justify-between gap-3 px-6 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.status}</p>
                </div>
                <span className={`status ${post.status === 'published' ? 's-ok' : post.status === 'draft' ? 's-warm' : ''}`}>{post.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="panel">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-semibold">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-xs text-warm transition-colors hover:text-foreground">View all</Link>
          </div>
          <div className="divide-y divide-line">
            {recentProjects.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">No projects yet</p>
            ) : recentProjects.map((project: any) => (
              <div key={project.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt="" className="h-8 w-8 rounded-[8px] object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-[8px] border border-line bg-muted" />
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
      <div className="panel mt-8 p-6">
        <h2 className="mb-4 font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/blog" className="btn-ghost">
            📝 New Blog Post
          </Link>
          <Link href="/dashboard/projects" className="btn-ghost">
            📁 New Project
          </Link>
          <Link href="/dashboard/media" className="btn-ghost">
            🖼 Upload Media
          </Link>
          <Link href="/dashboard/categories" className="btn-ghost">
            🏷 Manage Categories
          </Link>
          <Link href="/dashboard/skills" className="btn-ghost">
            ✦ Manage Skills
          </Link>
          <Link href="/dashboard/experiences" className="btn-ghost">
            ◷ Manage Experience
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
