import { Controller, Get, Post, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a contact form' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: { name: string; email: string; subject?: string; message: string }) {
    return this.prisma.contact.create({ data: dto });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all contact messages' })
  async findAll() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a contact message' })
  async remove(@Param('id') id: string) {
    await this.prisma.contact.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
