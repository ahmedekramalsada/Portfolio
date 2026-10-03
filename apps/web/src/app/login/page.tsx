import type { Metadata } from 'next';
import LoginClient from './login-client';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({ title: 'Admin sign in', description: 'Private administration access.', path: '/login', noIndex: true, localized: false });

export default function LoginPage() {
  return <LoginClient />;
}
