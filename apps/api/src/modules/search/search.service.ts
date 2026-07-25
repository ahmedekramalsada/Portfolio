import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private prisma: PrismaService) {}

  async search(query: string, type?: string, limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    const results: any[] = [];
    const tsquery = query.trim().split(/\s+/).join(' & ');

    if (!type || type === 'posts') {
      const posts = await this.prisma.$queryRaw<any[]>`
        SELECT id, title, slug, excerpt, 'post' as type, 
               ts_rank(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'')), plainto_tsquery('english', ${query})) as rank
        FROM "BlogPost"
        WHERE to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'')) @@ plainto_tsquery('english', ${query})
          AND "deletedAt" IS NULL AND status = 'published'
        ORDER BY rank DESC
        LIMIT ${limit} OFFSET ${skip}
      `;
      results.push(...posts);
    }

    if (!type || type === 'projects') {
      const projects = await this.prisma.$queryRaw<any[]>`
        SELECT id, title, slug, description as excerpt, 'project' as type,
               ts_rank(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')), plainto_tsquery('english', ${query})) as rank
        FROM "Project"
        WHERE to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')) @@ plainto_tsquery('english', ${query})
          AND "deletedAt" IS NULL
        ORDER BY rank DESC
        LIMIT ${limit} OFFSET ${skip}
      `;
      results.push(...projects);
    }

    if (!type || type === 'pages') {
      const pages = await this.prisma.$queryRaw<any[]>`
        SELECT id, title, slug, '' as excerpt, 'page' as type,
               ts_rank(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'')), plainto_tsquery('english', ${query})) as rank
        FROM "Page"
        WHERE to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'')) @@ plainto_tsquery('english', ${query})
          AND published = true AND "deletedAt" IS NULL
        ORDER BY rank DESC
        LIMIT ${limit} OFFSET ${skip}
      `;
      results.push(...pages);
    }

    // Sort combined results by rank
    results.sort((a: any, b: any) => (b.rank || 0) - (a.rank || 0));
    const total = results.length;

    // Log search
    await this.prisma.searchQuery.create({
      data: { query, resultsCount: total, duration: 0 },
    });

    return { data: results.slice(0, limit), meta: { query, total, page, limit } };
  }

  async suggestions(query: string) {
    if (query.length < 2) return [];

    const results = await this.prisma.$queryRaw<any[]>`
      (SELECT title as text, 'post' as type, slug FROM "BlogPost"
       WHERE title ILIKE ${'%' + query + '%'} AND "deletedAt" IS NULL AND status = 'published'
       LIMIT 3)
      UNION
      (SELECT title as text, 'project' as type, slug FROM "Project"
       WHERE title ILIKE ${'%' + query + '%'} AND "deletedAt" IS NULL
       LIMIT 3)
      LIMIT 6
    `;
    return results;
  }

  async trending() {
    const results = await this.prisma.searchQuery.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: 10,
    });
    return results.map((r) => ({ query: r.query, count: r._count.query }));
  }
}
