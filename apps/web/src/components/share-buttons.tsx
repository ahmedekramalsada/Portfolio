'use client';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, label: 'in' },
    { name: 'Twitter / X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, label: 'X' },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, label: 'f' },
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, label: 'wa' },
  ];

  return (
    <div className="flex items-center gap-2.5">
      <span className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">Share</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${link.name}`}
          aria-label={`Share on ${link.name}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-2 font-mono text-[12px] text-muted-foreground transition hover:border-warm hover:text-warm"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
