import { Controller, Get, Post, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit a contact form' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: { name: string; email: string; subject?: string; message: string }) {
    return this.prisma.contact.create({ data: dto });
  }

  @Get()
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all contact messages' })
  async findAll() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Delete(':id')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a contact message' })
  async remove(@Param('id') id: string) {
    await this.prisma.contact.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
