import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RagService } from './rag.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryDto } from './dto/rag.dto';

@ApiTags('RAG')
@Controller('rag')
export class RagController {
  constructor(private ragService: RagService) {}

  @Post('query')
  @ApiOperation({ summary: 'Search knowledge base' })
  async query(@Body() dto: QueryDto) {
    const results = await this.ragService.search(dto.query, dto.limit || 5);
    return { query: dto.query, results };
  }

  @Post('reindex')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reindex all content' })
  async reindex() {
    const results = await this.ragService.reindexAll();
    return { message: 'Reindex complete', items: results };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'RAG system status' })
  async status() {
    return this.ragService.getStatus();
  }

  @Post('index')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Index a specific document' })
  async index(@Body() dto: { sourceType: string; sourceId: string; title: string; content: string }) {
    return this.ragService.indexDocument(dto.sourceType, dto.sourceId, dto.title, dto.content);
  }
}
