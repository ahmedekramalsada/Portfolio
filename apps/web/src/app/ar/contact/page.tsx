import type { Metadata } from 'next';
import { PublicContact } from '@/components/site/public-contact';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'تواصل',
  description: 'تواصل مع أحمد أكرم السادة، مهندس DevOps في القاهرة، لمناقشة منصة موثوقة أو سؤال تقني.',
  path: '/ar/contact',
});

export default function ArabicContactPage() {
  return <PublicContact locale="ar" />;
}
