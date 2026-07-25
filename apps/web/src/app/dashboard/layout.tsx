'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◉' },
  { href: '/dashboard/blog', label: 'Blog Posts', icon: '📝' },
  { href: '/dashboard/projects', label: 'Projects', icon: '📁' },
  { href: '/dashboard/media', label: 'Media', icon: '🖼' },
  { href: '/dashboard/categories', label: 'Categories', icon: '🏷' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-muted/30 p-4 hidden md:block">
        <div className="mb-6">
          <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 pt-4 border-t">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
