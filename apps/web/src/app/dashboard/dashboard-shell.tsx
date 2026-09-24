'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◉' },
  { href: '/dashboard/contacts', label: 'Messages', icon: '📬' },
  { href: '/dashboard/blog', label: 'Blog Posts', icon: '📝' },
  { href: '/dashboard/projects', label: 'Projects', icon: '📁' },
  { href: '/dashboard/media', label: 'Media', icon: '🖼' },
  { href: '/dashboard/categories', label: 'Categories', icon: '🏷' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-card p-6 md:block">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[15px] font-semibold tracking-[-.02em] text-foreground transition-colors hover:text-warm">
            Ahmed OS
          </Link>
          <div className="mt-4 space-y-1">
            <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-dim capitalize">{user?.role || 'admin'}</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-[11px] border px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-warm/25 bg-warm/10 text-warm'
                    : 'border-transparent text-muted-foreground hover:bg-card hover:text-foreground'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 border-t border-line pt-6">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-[11px] border border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
