import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async upload(file: Express.Multer.File, userId: string) {
    const media = await this.prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        provider: 'local',
        path: `/uploads/${file.filename}`,
        publicUrl: `/uploads/${file.filename}`,
        uploadedBy: userId,
      },
    });
    return media;
  }

  async findAll(params: { page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.media.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.media.count(),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async remove(id: string) {
    const existing = await this.prisma.media.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Media not found');
    await this.prisma.media.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Media deleted' };
  }
}
