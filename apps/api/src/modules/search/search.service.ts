import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type SearchLanguage = 'en' | 'ar';
const PUBLIC_PROJECT_SLUGS = ['final-project-devops', 'final-project', 'ahmed-os'] as const;

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, type?: string, limit = 20, page = 1, language: SearchLanguage = 'en') {
    const cleanQuery = query.trim();
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const lang = language === 'ar' ? 'ar' : 'en';
    const like = `%${cleanQuery}%`;
    const publicProjectFilter = Prisma.sql`AND slug IN (${Prisma.join(PUBLIC_PROJECT_SLUGS)})`;
    const results: any[] = [];

    if (!cleanQuery) {
      return { data: [], meta: { query: '', total: 0, page: safePage, limit: safeLimit } };
    }

    if (!type || type === 'posts' || type === 'post') {
      const posts = await this.prisma.$queryRaw<any[]>`
        SELECT id, title, slug, excerpt, 'post' as type, language,
               CASE WHEN title ILIKE ${like} THEN 3 WHEN coalesce(content,'') ILIKE ${like} THEN 1 ELSE 0 END as rank
        FROM "BlogPost"
        WHERE (title ILIKE ${like} OR coalesce(content,'') ILIKE ${like})
          AND "deletedAt" IS NULL AND status = 'published' AND language = ${lang}
        ORDER BY rank DESC, "publishedAt" DESC
        LIMIT ${safeLimit} OFFSET ${skip}
      `;
      results.push(...posts);
    }

    if (!type || type === 'projects' || type === 'project') {
      const projects = await this.prisma.$queryRaw<any[]>`
        SELECT id, title, slug, description as excerpt, 'project' as type, NULL::text as language,
               CASE WHEN title ILIKE ${like} THEN 3 WHEN coalesce(description,'') ILIKE ${like} THEN 1 ELSE 0 END as rank
        FROM "Project"
        WHERE (title ILIKE ${like} OR coalesce(description,'') ILIKE ${like})
          AND "deletedAt" IS NULL ${publicProjectFilter}
        ORDER BY rank DESC, "updatedAt" DESC
        LIMIT ${safeLimit} OFFSET ${skip}
      `;
      results.push(...projects);
    }

    if (!type || type === 'pages' || type === 'page') {
      const pages = await this.prisma.$queryRaw<any[]>`
        SELECT id, title, slug, '' as excerpt, 'page' as type, NULL::text as language,
               CASE WHEN title ILIKE ${like} THEN 3 WHEN coalesce(content,'') ILIKE ${like} THEN 1 ELSE 0 END as rank
        FROM "Page"
        WHERE (title ILIKE ${like} OR coalesce(content,'') ILIKE ${like})
          AND published = true AND "deletedAt" IS NULL
        ORDER BY rank DESC, "updatedAt" DESC
        LIMIT ${safeLimit} OFFSET ${skip}
      `;
      results.push(...pages);
    }

    results.sort((a: any, b: any) => (b.rank || 0) - (a.rank || 0));
    const total = results.length;

    await this.prisma.searchQuery.create({
      data: { query: cleanQuery, resultsCount: total, duration: 0 },
    });

    return { data: results.slice(0, safeLimit), meta: { query: cleanQuery, total, page: safePage, limit: safeLimit } };
  }

  async suggestions(query: string, language: SearchLanguage = 'en') {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) return [];
    const lang = language === 'ar' ? 'ar' : 'en';
    const like = `%${cleanQuery}%`;

    return this.prisma.$queryRaw<any[]>`
      (SELECT title as text, 'post' as type, slug, language FROM "BlogPost"
       WHERE title ILIKE ${like} AND "deletedAt" IS NULL AND status = 'published' AND language = ${lang}
       LIMIT 3)
      UNION
      (SELECT title as text, 'project' as type, slug, NULL::text as language FROM "Project"
       WHERE title ILIKE ${like} AND "deletedAt" IS NULL AND slug IN (${Prisma.join(PUBLIC_PROJECT_SLUGS)})
       LIMIT 3)
      LIMIT 6
    `;
  }

  async trending() {
    const results = await this.prisma.searchQuery.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: 10,
    });
    return results.map((row) => ({ query: row.query, count: row._count.query }));
  }
}
