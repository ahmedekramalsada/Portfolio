'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localePath, otherLocalePath, type Locale } from '@/lib/site-content';

const navByLocale: Record<Locale, { href: string; label: string }[]> = {
  en: [
    { href: '/blog', label: 'Writing' },
    { href: '/projects', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  ar: [
    { href: '/blog', label: 'الكتابة' },
    { href: '/projects', label: 'الأعمال' },
    { href: '/about', label: 'عني' },
    { href: '/contact', label: 'تواصل' },
  ],
};

function getLocale(pathname: string): Locale {
  return pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
}

export function Navbar() {
  const pathname = usePathname() || '/';
  const locale = getLocale(pathname);
  const navLinks = navByLocale[locale];
  const otherPath = otherLocalePath(locale, pathname);
  const otherLabel = locale === 'en' ? 'العربية' : 'English';
  const [solid, setSolid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      setSolid(window.scrollY > 40);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-30 border-b transition-colors duration-300 ${solid ? 'border-line bg-background/72 backdrop-blur-xl' : 'border-transparent'}`}>
      <span className="fixed left-0 top-0 z-40 h-0.5 bg-gradient-to-r from-live to-warm" style={{ width: `${progress}%` }} aria-hidden />
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-6 lg:px-8">
        <Link href={localePath(locale)} className="flex min-w-0 items-center gap-3 text-[14.5px] font-semibold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/profile.webp" alt="Ahmed Ekram Alsada" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full border border-line-2 object-cover" style={{ objectPosition: '50% 20%' }} />
          <span className="truncate">{locale === 'ar' ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
            {navLinks.map((link) => {
              const href = localePath(locale, link.href);
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return <Link key={link.href} href={href} className={`rounded-[9px] border px-3.5 py-2 text-[13.5px] transition ${isActive ? 'border-line bg-muted text-foreground' : 'border-transparent text-muted-foreground hover:border-line hover:bg-card hover:text-foreground'}`}>{link.label}</Link>;
            })}
          </nav>
          <Link href={otherPath} className="hidden min-h-[40px] items-center rounded-[9px] border border-line-2 px-3 text-[12px] text-muted-foreground transition hover:border-warm hover:text-warm sm:inline-flex" aria-label={locale === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}>{otherLabel}</Link>
          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={mobileOpen} className="-mr-2 grid h-11 w-11 place-items-center rounded-lg border border-transparent text-muted-foreground hover:border-line hover:bg-card hover:text-foreground md:hidden">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
              {mobileOpen ? <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> : <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-background md:hidden" aria-label={locale === 'ar' ? 'التنقل للجوال' : 'Mobile navigation'}>
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => <Link key={link.href} href={localePath(locale, link.href)} className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-card hover:text-foreground">{link.label}</Link>)}
            <Link href={otherPath} className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-sm text-warm hover:bg-card">{otherLabel}</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
