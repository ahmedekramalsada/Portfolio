'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuthStore } from '@/stores/auth-store';

function DashboardContent() {
  const { user, logout } = useAuthStore();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="rounded-md border px-4 py-2 text-sm transition-colors hover:bg-accent"
        >
          Sign Out
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-lg font-semibold">Profile</h2>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Name: {user?.name || '—'}</p>
            <p>Email: {user?.email || '—'}</p>
            <p>Role: {user?.role || '—'}</p>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-lg font-semibold">Content</h2>
          <p className="text-sm text-muted-foreground">Coming soon</p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-lg font-semibold">System</h2>
          <p className="text-sm text-muted-foreground">Coming soon</p>
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
