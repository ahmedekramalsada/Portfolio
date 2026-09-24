import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SERVER_API_URL } from './api-config';
import { ACCESS_TOKEN_COOKIE } from './auth-cookie';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
};

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const response = await fetch(`${SERVER_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return (await response.json()) as AuthUser;
  } catch {
    return null;
  }
}

export async function requireDashboardUser(): Promise<AuthUser> {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login');
  return user;
}
