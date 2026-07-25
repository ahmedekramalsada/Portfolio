import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Contacts')
@Controller()
export class ContactsController {
  constructor(private prisma: PrismaService) {}

  @Post('contacts')
  @ApiOperation({ summary: 'Submit a contact form' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: { name: string; email: string; subject?: string; message: string }) {
    return this.prisma.contact.create({
      data: {
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
      },
    });
  }
}
