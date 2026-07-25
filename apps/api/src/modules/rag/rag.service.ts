import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private readonly qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
  private readonly collectionName = process.env.QDRANT_COLLECTION || 'knowledge';

  constructor(private prisma: PrismaService) {}

  // Generate embeddings using OpenRouter (OpenAI-compatible)
  private async embed(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('No API key configured for embeddings');

    this.logger.log(`Embedding text (${text.length} chars)...`);
    const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small',
        input: text.slice(0, 8000), // truncate to avoid token limits
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      this.logger.error(`Embedding API error: ${res.status} ${err}`);
      throw new Error(`Embedding failed: ${err}`);
    }

    const data: any = await res.json();
    if (!data.data || !data.data[0]) {
      this.logger.error(`Unexpected embedding response: ${JSON.stringify(data).slice(0, 200)}`);
      throw new Error('Unexpected embedding response format');
    }
    return data.data[0].embedding;
  }

  // Chunk text into segments
  private chunk(text: string, maxSize = 1000, overlap = 150): string[] {
    if (!text || text.length <= maxSize) return [text];
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + maxSize, text.length);
      chunks.push(text.slice(start, end));
      start = end - overlap;
    }
    return chunks;
  }

  // Ensure Qdrant collection exists
  private async ensureCollection() {
    const res = await fetch(`${this.qdrantUrl}/collections/${this.collectionName}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) return; // already exists

    // Create collection with 1536 dimensions (text-embedding-3-small)
    await fetch(`${this.qdrantUrl}/collections/${this.collectionName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vectors: { size: 1536, distance: 'Cosine' },
      }),
    });
    this.logger.log(`Created Qdrant collection: ${this.collectionName}`);
  }

  // Index a document
  async indexDocument(sourceType: string, sourceId: string, title: string, content: string) {
    await this.ensureCollection();

    // Save or update the document
    const doc = await this.prisma.knowledgeDocument.upsert({
      where: {
        id: sourceId,
      },
      update: { content, status: 'pending', lastIndexed: new Date() },
      create: {
        id: sourceId,
        title,
        sourceType,
        sourceId,
        content,
        status: 'pending',
      },
    });

    // Delete old chunks
    await this.prisma.knowledgeChunk.deleteMany({ where: { documentId: doc.id } });

    // Chunk the content
    const chunks = this.chunk(content);
    this.logger.log(`Indexing ${chunks.length} chunks for "${title}"`);

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];

      // Generate embedding
      const vector = await this.embed(chunkText);

      // Store in Qdrant
      const pointId = `${doc.id}-${i}`;
      const qdrantRes = await fetch(`${this.qdrantUrl}/collections/${this.collectionName}/points`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          points: [{
            id: pointId,
            vector,
            payload: {
              sourceType: doc.sourceType,
              sourceId: doc.sourceId,
              title,
              chunkIndex: i,
              content: chunkText,
            },
          }],
        }),
      });
      if (!qdrantRes.ok) {
        const err = await qdrantRes.text();
        this.logger.error(`Qdrant insert error: ${qdrantRes.status} ${err}`);
      } else {
        this.logger.log(`Stored chunk ${i + 1}/${chunks.length} in Qdrant`);
      }

      // Save chunk in DB
      await this.prisma.knowledgeChunk.create({
        data: {
          documentId: doc.id,
          chunkIndex: i,
          content: chunkText,
          tokenCount: chunkText.length / 4,
        },
      });
    }

    // Mark document as indexed
    await this.prisma.knowledgeDocument.update({
      where: { id: doc.id },
      data: { status: 'indexed', lastIndexed: new Date() },
    });

    return { chunksIndexed: chunks.length, documentId: doc.id };
  }

  // Search for relevant context
  async search(query: string, limit = 5) {
    const vector = await this.embed(query);

    const res = await fetch(`${this.qdrantUrl}/collections/${this.collectionName}/points/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector,
        limit,
        with_payload: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      this.logger.error(`Qdrant search failed: ${err}`);
      return [];
    }

    const data: any = await res.json();
    return data.result.map((r: any) => ({
      content: r.payload.content,
      title: r.payload.title,
      sourceType: r.payload.sourceType,
      score: r.score,
    }));
  }

  // Index all published content
  async reindexAll() {
    const results: any[] = [];

    // Index blog posts
    const posts = await this.prisma.blogPost.findMany({
      where: { status: 'published', deletedAt: null },
    });
    for (const post of posts) {
      const content = `${post.title}\n\n${post.excerpt || ''}\n\n${post.content || ''}`;
      const r = await this.indexDocument('blog', post.id, post.title, content);
      results.push({ type: 'blog', id: post.id, title: post.title, chunks: r.chunksIndexed });
    }

    // Index projects
    const projects = await this.prisma.project.findMany({
      where: { deletedAt: null },
    });
    for (const project of projects) {
      const content = `${project.title}\n\n${project.description || ''}\n\n${project.content || ''}`;
      const r = await this.indexDocument('project', project.id, project.title, content);
      results.push({ type: 'project', id: project.id, title: project.title, chunks: r.chunksIndexed });
    }

    // Index pages
    const pages = await this.prisma.page.findMany({ where: { published: true, deletedAt: null } });
    for (const page of pages) {
      const content = `${page.title}\n\n${page.content || ''}`;
      const r = await this.indexDocument('page', page.id, page.title, content);
      results.push({ type: 'page', id: page.id, title: page.title, chunks: r.chunksIndexed });
    }

    return results;
  }

  async getStatus() {
    const documents = await this.prisma.knowledgeDocument.groupBy({
      by: ['status'],
      _count: true,
    });

    let vectorCount = 0;
    try {
      const res = await fetch(`${this.qdrantUrl}/collections/${this.collectionName}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data: any = await res.json();
        vectorCount = data.result?.vectors_count || 0;
      }
    } catch {}

    return {
      documents,
      vectorsInQdrant: vectorCount,
      qdrantUrl: this.qdrantUrl,
      collectionName: this.collectionName,
    };
  }
}
