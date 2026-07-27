import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RagService } from '../rag/rag.service';

interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  handler: (params: any) => Promise<any>;
  requiredRole?: string;
}

@Injectable()
export class MCPService {
  private readonly logger = new Logger(MCPService.name);
  private tools: Map<string, MCPTool> = new Map();

  constructor(
    private prisma: PrismaService,
    private ragService: RagService,
  ) {
    this.registerTools();
  }

  private registerTools() {
    // === Content Tools ===
    this.register({
      name: 'create_post',
      description: 'Create a new blog post',
      inputSchema: { title: 'string', slug: 'string', content: 'string', excerpt: 'string?', coverImage: 'string?', categoryId: 'string?' },
      handler: async (params) => {
        return this.prisma.blogPost.create({ data: { ...params, authorId: 'd53bbbe4-4552-4dea-8930-c6da11b573e3' } });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'publish_post',
      description: 'Publish a blog post by ID',
      inputSchema: { id: 'string' },
      handler: async (params) => {
        const post = await this.resolvePost(params.id);
        return this.prisma.blogPost.update({ where: { id: post.id }, data: { status: 'published', publishedAt: new Date() } });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'delete_post',
      description: 'Soft delete a blog post',
      inputSchema: { id: 'string' },
      handler: async (params) => {
        const post = await this.resolvePost(params.id);
        return this.prisma.blogPost.update({ where: { id: post.id }, data: { deletedAt: new Date() } });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'update_post',
      description: 'Update an existing blog post',
      inputSchema: { id: 'string', title: 'string?', content: 'string?', excerpt: 'string?', coverImage: 'string?', status: 'string?' },
      handler: async (params) => {
        const { id, ...data } = params;
        const post = await this.resolvePost(id);
        return this.prisma.blogPost.update({ where: { id: post.id }, data });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'create_project',
      description: 'Create a new project',
      inputSchema: { title: 'string', slug: 'string', description: 'string?', content: 'string?', coverImage: 'string?', githubUrl: 'string?', demoUrl: 'string?', status: 'string?' },
      handler: async (params) => {
        return this.prisma.project.create({ data: { ...params, status: params.status || 'planning' } });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'update_project',
      description: 'Update an existing project',
      inputSchema: { id: 'string', title: 'string?', description: 'string?', content: 'string?', coverImage: 'string?', githubUrl: 'string?', demoUrl: 'string?', status: 'string?' },
      handler: async (params) => {
        const { id, ...data } = params;
        return this.prisma.project.update({ where: { id }, data });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'delete_project',
      description: 'Soft delete a project',
      inputSchema: { id: 'string' },
      handler: async (params) => {
        return this.prisma.project.update({ where: { id: params.id }, data: { deletedAt: new Date() } });
      },
      requiredRole: 'admin',
    });

    // === Media Tools ===
    this.register({
      name: 'list_media',
      description: 'List media files',
      inputSchema: { projectId: 'string?', limit: 'number?' },
      handler: async (params) => {
        const where = params.projectId ? { projectId: params.projectId } : {};
        return this.prisma.media.findMany({ where, orderBy: { createdAt: 'desc' }, take: params.limit || 50 });
      },
    });

    this.register({
      name: 'delete_media',
      description: 'Delete a media file',
      inputSchema: { id: 'string' },
      handler: async (params) => {
        await this.prisma.media.delete({ where: { id: params.id } });
        return { message: 'Deleted' };
      },
      requiredRole: 'admin',
    });

    // === Contact Tools ===
    this.register({
      name: 'create_contact',
      description: 'Submit a contact form message',
      inputSchema: { name: 'string', email: 'string', subject: 'string?', message: 'string' },
      handler: async (params) => {
        return this.prisma.contact.create({ data: params });
      },
    });

    this.register({
      name: 'list_contacts',
      description: 'List contact form submissions',
      inputSchema: { limit: 'number?' },
      handler: async (params) => {
        return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, take: params.limit || 50 });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'delete_contact',
      description: 'Delete a contact message',
      inputSchema: { id: 'string' },
      handler: async (params) => {
        await this.prisma.contact.delete({ where: { id: params.id } });
        return { message: 'Deleted' };
      },
      requiredRole: 'admin',
    });

    // === Experience Tools ===
    this.register({
      name: 'create_experience',
      description: 'Add a work experience entry',
      inputSchema: { company: 'string', position: 'string', description: 'string?', startDate: 'string?', endDate: 'string?', current: 'boolean?' },
      handler: async (params) => {
        const expData: any = {
          company: params.company,
          position: params.position,
          description: params.description || '',
        };
        if (params.startDate) expData.startDate = new Date(params.startDate);
        if (params.endDate) expData.endDate = new Date(params.endDate);
        return this.prisma.experience.create({ data: expData });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'list_experiences',
      description: 'List work experience entries',
      inputSchema: {},
      handler: async () => {
        return this.prisma.experience.findMany({ orderBy: { startDate: 'desc' } });
      },
    });

    // === Search Tools ===
    this.register({
      name: 'search',
      description: 'Search across posts, projects, and knowledge',
      inputSchema: { query: 'string', type: 'string?', limit: 'number?' },
      handler: async (params) => {
        const limit = params.limit || 5;
        const results: any[] = [];

        if (!params.type || params.type === 'posts') {
          const posts = await this.prisma.blogPost.findMany({
            where: { title: { contains: params.query, mode: 'insensitive' }, deletedAt: null },
            take: limit,
            select: { id: true, title: true, slug: true, status: true, publishedAt: true },
          });
          results.push(...posts.map((p) => ({ type: 'post', ...p })));
        }

        if (!params.type || params.type === 'projects') {
          const projects = await this.prisma.project.findMany({
            where: { title: { contains: params.query, mode: 'insensitive' }, deletedAt: null },
            take: limit,
            select: { id: true, title: true, slug: true, status: true },
          });
          results.push(...projects.map((p) => ({ type: 'project', ...p })));
        }

        return { results, total: results.length };
      },
    });

    // === RAG Tools ===
    this.register({
      name: 'search_knowledge',
      description: 'Semantic search across the knowledge base',
      inputSchema: { query: 'string', limit: 'number?' },
      handler: async (params) => {
        try {
          return await this.ragService.search(params.query, params.limit || 5);
        } catch {
          return { results: [], error: 'Knowledge base not available' };
        }
      },
    });

    this.register({
      name: 'reindex_knowledge',
      description: 'Reindex all content into the knowledge base',
      inputSchema: {},
      handler: async () => {
        try {
          return await this.ragService.reindexAll();
        } catch {
          return { error: 'Reindex failed' };
        }
      },
      requiredRole: 'admin',
    });

    // === System Tools ===
    this.register({
      name: 'health',
      description: 'Check system health with full stats',
      inputSchema: {},
      handler: async () => {
        const [postCount, projectCount, mediaCount, contactCount, experienceCount] = await Promise.all([
          this.prisma.blogPost.count({ where: { deletedAt: null } }),
          this.prisma.project.count({ where: { deletedAt: null } }),
          this.prisma.media.count(),
          this.prisma.contact.count(),
          this.prisma.experience.count(),
        ]);
        return {
          status: 'ok',
          timestamp: new Date().toISOString(),
          stats: { posts: postCount, projects: projectCount, media: mediaCount, contacts: contactCount, experiences: experienceCount },
        };
      },
    });

    this.register({
      name: 'list_tools',
      description: 'List all available MCP tools',
      inputSchema: {},
      handler: async () => {
        return Array.from(this.tools.entries()).map(([name, tool]) => ({
          name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        }));
      },
    });

    this.logger.log(`Registered ${this.tools.size} MCP tools`);
  }

  private register(tool: MCPTool) {
    this.tools.set(tool.name, tool);
  }

  private async resolvePost(idOrSlug: string) {
    const isUUID = /^[0-9a-f-]{36}$/i.test(idOrSlug);
    if (isUUID) {
      const post = await this.prisma.blogPost.findUnique({ where: { id: idOrSlug } });
      if (!post) throw new Error('Post not found');
      return post;
    }
    const post = await this.prisma.blogPost.findUnique({ where: { slug: idOrSlug } });
    if (!post) throw new Error('Post not found');
    return post;
  }

  getTools() {
    return Array.from(this.tools.entries()).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));
  }

  async execute(toolName: string, params: any, user?: any) {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool "${toolName}" not found`);
    }

    if (tool.requiredRole) {
      if (!user || user.role !== tool.requiredRole) {
        throw new Error('Unauthorized: admin role required');
      }
    }

    this.logger.log(`Executing MCP tool: ${toolName}`);
    const start = Date.now();

    try {
      const result = await tool.handler(params);
      this.logger.log(`MCP tool ${toolName} completed in ${Date.now() - start}ms`);
      return { success: true, data: result };
    } catch (error: any) {
      this.logger.error(`MCP tool ${toolName} failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
