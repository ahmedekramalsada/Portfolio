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
      inputSchema: { title: 'string', slug: 'string', content: 'string', excerpt: 'string?', categoryId: 'string?' },
      handler: async (params) => {
        return this.prisma.blogPost.create({ data: { ...params, authorId: 'mcp' } });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'publish_post',
      description: 'Publish a blog post by ID',
      inputSchema: { id: 'string' },
      handler: async (params) => {
        return this.prisma.blogPost.update({ where: { id: params.id }, data: { status: 'published', publishedAt: new Date() } });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'delete_post',
      description: 'Soft delete a blog post',
      inputSchema: { id: 'string' },
      handler: async (params) => {
        return this.prisma.blogPost.update({ where: { id: params.id }, data: { deletedAt: new Date() } });
      },
      requiredRole: 'admin',
    });

    this.register({
      name: 'create_project',
      description: 'Create a new project',
      inputSchema: { title: 'string', slug: 'string', description: 'string?', status: 'string?' },
      handler: async (params) => {
        return this.prisma.project.create({ data: { ...params, status: params.status || 'planning' } });
      },
      requiredRole: 'admin',
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
      description: 'Check system health',
      inputSchema: {},
      handler: async () => {
        const postCount = await this.prisma.blogPost.count();
        const projectCount = await this.prisma.project.count();
        return { status: 'ok', timestamp: new Date().toISOString(), stats: { posts: postCount, projects: projectCount } };
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

    // Auth check
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
