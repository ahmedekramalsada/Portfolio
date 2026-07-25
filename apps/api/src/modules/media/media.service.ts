import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private prisma: PrismaService) {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucket = process.env.R2_BUCKET || 'ahmedekramalsada';
  }

  async upload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    if (file.size > 10 * 1024 * 1024) throw new BadRequestException('File too large (max 10MB)');

    const key = `media/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const media = await this.prisma.media.create({
      data: {
        filename: key.split('/').pop() || file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        provider: 'r2',
        path: key,
        publicUrl: `${process.env.R2_ENDPOINT || 'https://fbf23646cc6184a8c0838e10b3ffd2ad.r2.cloudflarestorage.com'}/${this.bucket}/${key}`,
      },
    });

    this.logger.log(`Uploaded: ${key} (${(file.size / 1024).toFixed(1)}KB)`);
    return media;
  }

  async findAll(limit = 50) {
    return this.prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  }

  async delete(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new BadRequestException('Media not found');

    try {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: media.path }));
    } catch (e) {
      this.logger.warn(`R2 delete failed for ${media.path}: ${e}`);
    }

    await this.prisma.media.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
