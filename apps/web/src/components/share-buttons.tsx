'use client';

import { useState } from 'react';

type Props = { title: string; url: string; locale?: 'en' | 'ar'; label?: string };

export function ShareButtons({ title, url, locale = 'en', label }: Props) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareLabel = label || (locale === 'ar' ? 'مشاركة' : 'Share');
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* the URL remains visible in the address bar */ }
  };
  const links = [
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, label: 'in' },
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, label: 'wa' },
    { name: 'X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, label: 'X' },
  ];
  return <div className="flex flex-wrap items-center gap-2.5"><span className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">{shareLabel}</span>{links.map((link) => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" title={`${shareLabel} ${link.name}`} aria-label={`${shareLabel} ${link.name}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-2 font-mono text-[12px] text-muted-foreground transition hover:border-warm hover:text-warm">{link.label}</a>)}<button type="button" onClick={copyLink} className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-line-2 px-3 font-mono text-[10.5px] uppercase tracking-[.07em] text-muted-foreground transition hover:border-warm hover:text-warm" aria-label={copied ? (locale === 'ar' ? 'تم نسخ الرابط' : 'Link copied') : (locale === 'ar' ? 'نسخ الرابط' : 'Copy link')}>{copied ? (locale === 'ar' ? 'تم النسخ' : 'Copied') : (locale === 'ar' ? 'نسخ' : 'Copy')}</button></div>;
}
