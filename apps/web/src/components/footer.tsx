import Link from 'next/link';

const columns = [
  {
    title: 'Site',
    links: [
      { href: '/blog', label: 'Writing' },
      { href: '/projects', label: 'Work' },
      { href: '/about', label: 'About' },
      { href: '/resume', label: 'Résumé' },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { href: 'https://github.com/ahmedekramalsada', label: 'GitHub' },
      { href: 'https://linkedin.com/in/ahmedekramalsada', label: 'LinkedIn' },
      { href: '/contact', label: 'Contact' },
      { href: '/search', label: 'Search' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-background">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3 text-[14.5px] font-semibold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile.webp"
              alt="Ahmed Ekram Alsada"
              width={30}
              height={30}
              className="h-[30px] w-[30px] shrink-0 rounded-full border border-line-2 object-cover"
              style={{ objectPosition: '50% 20%' }}
            />
            Ahmed Ekram Alsada
          </div>
          <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-muted-foreground">
            DevOps engineer. I build and operate the systems other people depend on — and I keep them quiet.
          </p>
          <div className="mt-5 inline-flex items-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[.08em] text-muted-foreground">
            <span className="pulse-dot block h-1.5 w-1.5 rounded-full bg-ok" />
            Infrastructure monitored
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="label mb-4">{column.title}</h3>
            <ul className="flex flex-col gap-1">
              {column.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('http') ? (
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[36px] items-center text-[14.5px] text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link href={link.href} className="inline-flex min-h-[36px] items-center text-[14.5px] text-muted-foreground transition hover:text-foreground">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="hairline border-t border-line" />
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-6 py-6 text-[12.5px] text-dim sm:flex-row lg:px-8">
        <span>© {new Date().getFullYear()} Ahmed Ekram Alsada. Built with Next.js and NestJS.</span>
        <span className="font-mono">Cairo, Egypt · available for platform work</span>
      </div>
    </footer>
  );
}
