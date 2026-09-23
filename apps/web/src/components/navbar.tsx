'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/projects', label: 'Work' },
  { href: '/blog', label: 'Writing' },
  { href: '/#how-it-ships', label: 'How it ships' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Résumé' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
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
    <header
      className={`fixed inset-x-0 top-0 z-30 border-b transition-colors duration-300 ${
        solid ? 'border-line bg-background/72 backdrop-blur-xl' : 'border-transparent'
      }`}
    >
      <span
        className="fixed left-0 top-0 z-40 h-0.5 bg-gradient-to-r from-live to-warm"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-[14.5px] font-semibold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile.webp"
            alt="Ahmed Ekram Alsada"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full border border-line-2 object-cover"
            style={{ objectPosition: '50% 20%' }}
          />
          Ahmed Ekram Alsada
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== '/' && !link.href.startsWith('/#') && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[9px] border px-3.5 py-2 text-[13.5px] transition ${
                  isActive
                    ? 'border-line bg-muted text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-line hover:bg-card hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="-mr-2 grid h-11 w-11 place-items-center rounded-lg border border-transparent text-muted-foreground hover:border-line hover:bg-card hover:text-foreground md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-background md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-card hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
