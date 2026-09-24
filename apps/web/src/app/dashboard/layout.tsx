import type { Metadata } from 'next';
import { DashboardShell } from './dashboard-shell';
import { requireDashboardUser } from '@/lib/server-auth';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireDashboardUser();
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
