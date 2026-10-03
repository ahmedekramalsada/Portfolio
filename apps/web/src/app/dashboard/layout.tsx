import type { Metadata } from 'next';
import { DashboardShell } from './dashboard-shell';
import { requireDashboardUser } from '@/lib/server-auth';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({ title: 'Dashboard', description: 'Private content administration.', path: '/dashboard', noIndex: true, localized: false });

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireDashboardUser();
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
