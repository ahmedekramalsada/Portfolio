import type { Metadata } from 'next';
import { PublicHome } from '@/components/site/public-home';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'مهندس DevOps',
  description: 'مهندس DevOps أبني منصات سحابية موثوقة وأنظمة أعمال مدعومة بالذكاء الاصطناعي، وأكتب عن Docker وKubernetes وCI/CD والبنية التحتية.',
  path: '/ar',
});

export default function ArabicHomePage() {
  return <PublicHome locale="ar" />;
}
