'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localePath, otherLocalePath, type Locale } from '@/lib/site-content';

function getLocale(pathname: string): Locale {
  return pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
}

export function Footer() {
  const pathname = usePathname() || '/';
  const locale = getLocale(pathname);
  const ar = locale === 'ar';
  const columns = [
    { title: ar ? 'الموقع' : 'Site', links: [{ href: '/blog', label: ar ? 'الكتابة' : 'Writing' }, { href: '/projects', label: ar ? 'الأعمال' : 'Work' }, { href: '/about', label: ar ? 'عني' : 'About' }] },
    { title: ar ? 'في مكان آخر' : 'Elsewhere', links: [{ href: 'https://github.com/ahmedekramalsada', label: 'GitHub' }, { href: 'https://www.linkedin.com/in/ahmedekramalsada', label: 'LinkedIn' }, { href: '/contact', label: ar ? 'تواصل' : 'Contact' }, { href: '/search', label: ar ? 'بحث' : 'Search' }] },
  ];

  return (
    <footer className="relative z-10 border-t border-line bg-background">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3 text-[14.5px] font-semibold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/profile.webp" alt="Ahmed Ekram Alsada" width={30} height={30} className="h-[30px] w-[30px] shrink-0 rounded-full border border-line-2 object-cover" style={{ objectPosition: '50% 20%' }} />
            {ar ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada'}
          </div>
          <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-muted-foreground">{ar ? 'مهندس DevOps في القاهرة. أبني أنظمة سحابية ومواقع أعمال موثوقة، وأكتب ما أتعلمه أثناء العمل.' : 'DevOps engineer in Cairo. I build reliable cloud platforms and business systems, and I write down what I learn along the way.'}</p>
          <div className="mt-5 inline-flex items-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[.08em] text-muted-foreground"><span className="pulse-dot block h-1.5 w-1.5 rounded-full bg-ok" />{ar ? 'بنية تحتية موثوقة' : 'Reliable infrastructure'}</div>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="label mb-4">{column.title}</h3>
            <ul className="flex flex-col gap-1">
              {column.links.map((link) => <li key={link.href}><Link href={link.href.startsWith('http') ? link.href : localePath(locale, link.href)} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="inline-flex min-h-[40px] min-w-[40px] items-center justify-start px-1 text-[14.5px] text-muted-foreground transition hover:text-foreground">{link.label}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="hairline border-t border-line" />
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-6 py-6 text-[12.5px] text-dim sm:flex-row lg:px-8">
        <span>© {new Date().getFullYear()} {ar ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada'}. {ar ? 'مبني باستخدام Next.js وNestJS.' : 'Built with Next.js and NestJS.'}</span>
        <div className="flex items-center gap-4"><span className="font-mono">{ar ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span><Link href={otherLocalePath(locale, pathname)} className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center font-mono text-warm hover:underline">{ar ? 'English' : 'العربية'}</Link></div>
      </div>
    </footer>
  );
}
