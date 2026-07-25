import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MCPService } from './mcp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('MCP')
@Controller('mcp')
export class MCPController {
  constructor(private mcpService: MCPService) {}

  @Get('tools')
  @ApiOperation({ summary: 'List all MCP tools' })
  listTools() {
    return this.mcpService.getTools();
  }

  @Post('execute')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Execute an MCP tool' })
  async execute(@Body() body: { tool: string; params: any }, @Req() req: any) {
    return this.mcpService.execute(body.tool, body.params, req.user);
  }

  @Get('status')
  @ApiOperation({ summary: 'MCP server status' })
  status() {
    return {
      server: 'Ahmed OS MCP',
      version: '1.0',
      tools: this.mcpService.getTools().length,
      status: 'running',
    };
  }
}
