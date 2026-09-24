import type { Metadata } from 'next';
import { PublicAbout } from '@/components/site/public-about';
import { generatePageMetadata } from '@/config/seo';
export const metadata: Metadata = generatePageMetadata({ title: 'عني', description: 'عن أحمد أكرم السادة، مهندس DevOps في القاهرة يعمل على منصات سحابية موثوقة وأنظمة ذكاء اصطناعي عملية.', path: '/ar/about' });
export default function ArabicAboutPage() { return <PublicAbout locale="ar" />; }
