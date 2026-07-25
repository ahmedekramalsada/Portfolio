import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(private prisma: PrismaService) {}

  private getModel(provider?: string, model?: string): BaseChatModel {
    const prov = provider || process.env.DEFAULT_AI_PROVIDER || 'openai';
    const mdl = model || process.env.DEFAULT_AI_MODEL || 'gpt-4o-mini';

    switch (prov) {
      case 'openai':
        return new ChatOpenAI({
          model: mdl,
          temperature: 0.7,
          apiKey: process.env.OPENAI_API_KEY,
        });
      case 'openrouter':
        return new ChatOpenAI({
          model: mdl,
          temperature: 0.7,
          apiKey: process.env.OPENAI_API_KEY,
          configuration: { baseURL: 'https://openrouter.ai/api/v1' },
        });
      case 'anthropic':
        return new ChatAnthropic({
          model: mdl,
          temperature: 0.7,
          apiKey: process.env.ANTHROPIC_API_KEY,
        });
      default:
        return new ChatOpenAI({
          model: mdl,
          temperature: 0.7,
          apiKey: process.env.OPENAI_API_KEY,
        });
    }
  }

  async chat(message: string, conversationId?: string, provider?: string, model?: string) {
    const llm = this.getModel(provider, model);
    const systemPrompt = 'You are Ahmed OS AI assistant. Answer questions about Ahmed Ekram Al Sada, his projects, skills, and experience. Be helpful, concise, and factual.';

    let conversation = conversationId
      ? await this.prisma.aIConversation.findUnique({ where: { id: conversationId } })
      : null;

    if (!conversation) {
      conversation = await this.prisma.aIConversation.create({
        data: {
          title: message.slice(0, 100),
          provider: provider || 'openai',
          model: model || 'gpt-4o-mini',
        },
      });
    }

    // Get conversation history
    const history = conversationId
      ? await this.prisma.aIMessage.findMany({
          where: { conversationId },
          orderBy: { createdAt: 'asc' },
          take: 20,
        })
      : [];

    const messages = [
      new SystemMessage(systemPrompt),
      ...history.map((m) =>
        m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
      ),
      new HumanMessage(message),
    ];

    // Save user message
    await this.prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    });

    const response = await llm.invoke(messages);
    const reply = response.content.toString();

    // Save assistant message
    await this.prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: reply,
        tokenUsage: typeof response.usage_metadata?.total_tokens === 'number' ? response.usage_metadata.total_tokens : undefined,
      },
    });

    return {
      reply,
      conversationId: conversation.id,
    };
  }

  async getConversations(userId?: string) {
    return this.prisma.aIConversation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { _count: { select: { messages: true } } },
    });
  }

  async getConversation(id: string) {
    return this.prisma.aIConversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async deleteConversation(id: string) {
    await this.prisma.aIMessage.deleteMany({ where: { conversationId: id } });
    await this.prisma.aIConversation.delete({ where: { id } });
    return { message: 'Conversation deleted' };
  }

  async summarize(content: string) {
    const llm = this.getModel('openai', 'gpt-4o-mini');
    const response = await llm.invoke([
      new SystemMessage('Summarize the following text concisely. Preserve key technical details.'),
      new HumanMessage(content),
    ]);
    return { summary: response.content.toString() };
  }

  async generateSEO(title: string, content: string) {
    const llm = this.getModel('openai', 'gpt-4o-mini');
    const response = await llm.invoke([
      new SystemMessage('Generate SEO metadata for a blog post. Return JSON with: metaTitle, metaDescription, keywords (array), ogImage suggestion.'),
      new HumanMessage(`Title: ${title}\n\nContent: ${content.slice(0, 2000)}`),
    ]);
    return { seo: response.content.toString() };
  }
}
