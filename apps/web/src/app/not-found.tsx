import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { localePath } from '@/lib/site-content';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function NotFoundPage() {
  const locale = (await headers()).get('x-ahmed-locale') === 'ar' ? 'ar' : 'en';
  return (
    <div className="page text-center">
      <span className="label">404</span>
      <h1 className="h1 mt-5">{locale === 'ar' ? 'هذه الصفحة غير موجودة' : 'This page does not exist'}</h1>
      <p className="lede mx-auto">
        {locale === 'ar' ? 'العنوان غير صحيح، أو تم نقل الصفحة.' : 'The address you followed is wrong, or the page has been moved.'}
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href={localePath(locale)} className="btn-primary">{locale === 'ar' ? 'الصفحة الرئيسية' : 'Go home'} <span aria-hidden>→</span></Link>
        <Link href={localePath(locale, '/blog')} className="btn-ghost">{locale === 'ar' ? 'اقرأ المقالات' : 'Read the writing'}</Link>
      </div>
    </div>
  );
}
