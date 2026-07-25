import { Controller, Get, Post, Patch, Delete, Param, Query, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.upload(file);
  }

  @Get()
  @ApiOperation({ summary: 'List media' })
  findAll(@Query('projectId') projectId?: string, @Query('limit') limit?: number) {
    return this.mediaService.findAll(projectId, limit || 50);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete media' })
  delete(@Param('id') id: string) { return this.mediaService.delete(id); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update media metadata' })
  update(@Param('id') id: string, @Body() dto: any) { return this.mediaService.update(id, dto); }
}
