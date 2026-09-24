import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/seo';

export const dynamic = 'force-static';

export async function GET() {
  const text = `# ${siteConfig.name}

> DevOps Engineer in Cairo building reliable cloud platforms and AI-powered business systems.

This site is Ahmed Ekram Alsada's bilingual developer portfolio and writing site. English is the primary international-language version; Arabic is a real RTL site, not a machine translation of the navigation. The site makes no unsupported client, employer, metric, or production-deployment claims.

## Start here

- [English home](https://ahmedekram.site/)
- [Arabic home](https://ahmedekram.site/ar)
- [About Ahmed](https://ahmedekram.site/about): [Arabic](https://ahmedekram.site/ar/about)
- [Selected work](https://ahmedekram.site/projects): [Arabic](https://ahmedekram.site/ar/projects)
- [Writing](https://ahmedekram.site/blog): [Arabic](https://ahmedekram.site/ar/blog)
- [Contact](https://ahmedekram.site/contact): [Arabic](https://ahmedekram.site/ar/contact)

## Verified public evidence

- [End-to-end DevOps capstone](https://github.com/ahmedekramalsada/final-project-devops)
- [NTI final project](https://github.com/ahmedekramalsada/final-project)
- [Ahmed OS source](https://github.com/ahmedekramalsada/Portfolio)
- [GitHub profile](https://github.com/ahmedekramalsada)
- [LinkedIn profile](https://www.linkedin.com/in/ahmedekramalsada)

## Machine-readable resources

- [Sitemap](https://ahmedekram.site/sitemap.xml)
- [English RSS](https://ahmedekram.site/feed.xml)
- [Arabic RSS](https://ahmedekram.site/feed.xml?lang=ar)
- [Person JSON-LD](https://ahmedekram.site/json-ld/person)
- [Website JSON-LD](https://ahmedekram.site/json-ld/website)

## Scope note

Search engines and AI answer systems are not required to use this file. The durable SEO signals are crawlable HTML, truthful metadata, internal links, structured data, sitemap.xml, robots.txt, and useful original content.
`;

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
