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
            <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] border border-line-2 bg-gradient-to-b from-muted to-card font-mono text-[11px] text-warm">
              AE
            </span>
            Ahmed Ekram Al Sada
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
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-[14px] text-muted-foreground transition hover:text-foreground">
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
        <span>© {new Date().getFullYear()} Ahmed Ekram Al Sada. Built with Next.js and NestJS.</span>
        <span className="font-mono">Cairo, Egypt · available for platform work</span>
      </div>
    </footer>
  );
}
