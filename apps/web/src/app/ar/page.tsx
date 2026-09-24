import type { Metadata } from 'next';
import { PublicHome } from '@/components/site/public-home';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'مهندس DevOps في القاهرة',
  description: 'مهندس DevOps في القاهرة أبني منصات سحابية موثوقة وأنظمة أعمال مدعومة بالذكاء الاصطناعي، وأكتب عن Docker وKubernetes وCI/CD والبنية التحتية.',
  path: '/ar',
});

export default function ArabicHomePage() {
  return <PublicHome locale="ar" />;
}
