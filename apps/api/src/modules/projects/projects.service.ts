import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number; featured?: boolean; status?: string }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (params.featured) where.featured = true;
    if (params.status) where.status = params.status;

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          technologies: { include: { technology: { select: { id: true, name: true, slug: true, icon: true } } } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects.map((p) => ({ ...p, technologies: p.technologies.map((pt) => pt.technology) })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug, deletedAt: null },
      include: { technologies: { include: { technology: true } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return { ...project, technologies: project.technologies.map((pt) => pt.technology) };
  }

  async create(data: any) {
    const { technologies, ...projectData } = data;
    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        technologies: technologies?.length
          ? { create: technologies.map((tId: string) => ({ technologyId: tId })) }
          : undefined,
      },
      include: { technologies: { include: { technology: true } } },
    });
    return { ...project, technologies: project.technologies.map((pt) => pt.technology) };
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundException('Project not found');
    const { technologies, ...projectData } = data;
    if (technologies) await this.prisma.projectTag.deleteMany({ where: { projectId: id } });
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        technologies: technologies?.length
          ? { create: technologies.map((tId: string) => ({ technologyId: tId })) }
          : undefined,
      },
      include: { technologies: { include: { technology: true } } },
    });
    return { ...project, technologies: project.technologies.map((pt) => pt.technology) };
  }

  async remove(id: string) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundException('Project not found');
    await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Project deleted' };
  }
}
