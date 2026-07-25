import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Get()
  @ApiOperation({ summary: 'List all pages' })
  findAll() { return this.pagesService.findAll(); }

  @Get(':slug')
  @ApiOperation({ summary: 'Get page by slug' })
  findBySlug(@Param('slug') slug: string) { return this.pagesService.findBySlug(slug); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a page' })
  create(@Body() dto: any) { return this.pagesService.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a page' })
  update(@Param('id') id: string, @Body() dto: any) { return this.pagesService.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a page' })
  remove(@Param('id') id: string) { return this.pagesService.remove(id); }
}
