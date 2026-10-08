'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, fetchMe } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetchMe().finally(() => {
      if (!cancelled) setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchMe]);

  useEffect(() => {
    if (!checking && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [checking, isLoading, isAuthenticated, router]);

  if (checking || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
