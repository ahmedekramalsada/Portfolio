import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number; status?: string; categoryId?: string }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (params.status) where.status = params.status;
    if (params.categoryId) where.categoryId = params.categoryId;

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
          author: { select: { id: true, name: true } },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data: posts.map((p) => ({
        ...p,
        tags: p.tags.map((pt) => pt.tag),
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, deletedAt: null },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
        author: { select: { id: true, name: true } },
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    return { ...post, tags: post.tags.map((pt) => pt.tag) };
  }

  async create(data: any, authorId: string) {
    const { tags, ...postData } = data;
    const post = await this.prisma.blogPost.create({
      data: {
        ...postData,
        authorId,
        tags: tags?.length
          ? { create: tags.map((tagId: string) => ({ tagId })) }
          : undefined,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
        author: { select: { id: true, name: true } },
      },
    });
    return { ...post, tags: post.tags.map((pt) => pt.tag) };
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundException('Post not found');

    const { tags, ...postData } = data;

    if (tags) {
      await this.prisma.postTag.deleteMany({ where: { postId: id } });
    }

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        tags: tags?.length
          ? { create: tags.map((tagId: string) => ({ tagId })) }
          : undefined,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
        author: { select: { id: true, name: true } },
      },
    });
    return { ...post, tags: post.tags.map((pt) => pt.tag) };
  }

  async remove(id: string) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundException('Post not found');
    await this.prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Post deleted' };
  }

  async publish(id: string) {
    const post = await this.prisma.blogPost.update({
      where: { id },
      data: { status: 'published', publishedAt: new Date() },
    });
    return post;
  }

  async archive(id: string) {
    const post = await this.prisma.blogPost.update({
      where: { id },
      data: { status: 'archived' },
    });
    return post;
  }
}
