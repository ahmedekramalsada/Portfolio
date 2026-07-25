import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatDto, SummarizeDto, SEODto } from './dto/ai.dto';

@ApiTags('AI')
@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI assistant' })
  async chat(@Body() dto: ChatDto) {
    return this.aiService.chat(dto.message, dto.conversationId, dto.provider, dto.model);
  }

  @Post('summarize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Summarize text' })
  async summarize(@Body() dto: SummarizeDto) {
    return this.aiService.summarize(dto.content);
  }

  @Post('seo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate SEO metadata' })
  async generateSEO(@Body() dto: SEODto) {
    return this.aiService.generateSEO(dto.title, dto.content);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversation history' })
  async getConversations() {
    return this.aiService.getConversations();
  }

  @Get('conversations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single conversation' })
  async getConversation(@Param('id') id: string) {
    return this.aiService.getConversation(id);
  }

  @Delete('conversations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a conversation' })
  async deleteConversation(@Param('id') id: string) {
    return this.aiService.deleteConversation(id);
  }
}
