import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Full-text search across all content' })
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.searchService.search(query || '', type, limit, page);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Autocomplete suggestions' })
  async suggestions(@Query('q') query: string) {
    return this.searchService.suggestions(query || '');
  }

  @Get('trending')
  @ApiOperation({ summary: 'Trending search queries' })
  async trending() {
    return this.searchService.trending();
  }
}
