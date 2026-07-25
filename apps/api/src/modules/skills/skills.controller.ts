import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all skills' })
  async findAll() {
    return this.prisma.skill.findMany({ orderBy: { level: 'desc' } });
  }
}
