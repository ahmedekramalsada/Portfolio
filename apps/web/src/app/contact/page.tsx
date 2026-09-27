import type { Metadata } from 'next';
import { PublicContact } from '@/components/site/public-contact';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact',
  description: 'Contact Ahmed Ekram Alsada, a DevOps Engineer, to discuss a reliable platform or a technical question.',
  path: '/contact',
});

export default function ContactPage() {
  return <PublicContact locale="en" />;
}
