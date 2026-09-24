'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-6 grid h-10 w-10 place-items-center rounded-xl border border-line-2 bg-gradient-to-b from-muted to-card font-mono text-[12px] text-warm">
            AE
          </span>
          <h1 className="h2">Sign in</h1>
          <p className="mt-3 text-[14px] text-muted-foreground">Admin panel access only.</p>
        </div>

        <form onSubmit={handleSubmit} className="panel flex flex-col gap-5 p-7">
          {error && (
            <div className="rounded-xl border border-[#6d3b34] bg-[#2a1614] px-4 py-3 text-[13.5px] text-[#e8977f]">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="label-field">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              placeholder="admin@ahmedekram.site"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="label-field">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary justify-center disabled:opacity-50">
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[.09em] text-dim">
          Content API also accepts a bearer token
        </p>
      </div>
    </div>
  );
}
