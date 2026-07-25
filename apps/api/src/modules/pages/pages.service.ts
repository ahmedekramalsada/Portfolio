import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.page.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findFirst({ where: { slug, deletedAt: null } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async create(data: any) {
    return this.prisma.page.create({ data });
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.page.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundException('Page not found');
    return this.prisma.page.update({ where: { id }, data });
  }

  async remove(id: string) {
    const existing = await this.prisma.page.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundException('Page not found');
    await this.prisma.page.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Page deleted' };
  }
}
