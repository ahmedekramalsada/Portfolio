import { Module } from '@nestjs/common';
import { MCPController } from './mcp.controller';
import { MCPService } from './mcp.service';
import { RagModule } from '../rag/rag.module';

@Module({
  imports: [RagModule],
  controllers: [MCPController],
  providers: [MCPService],
  exports: [MCPService],
})
export class MCPModule {}
