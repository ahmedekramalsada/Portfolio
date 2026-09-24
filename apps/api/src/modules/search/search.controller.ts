import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

type SearchLanguage = 'en' | 'ar';

function language(value?: string): SearchLanguage {
  return value === 'ar' ? 'ar' : 'en';
}

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Language-aware full-text search across public content' })
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('lang') lang?: string,
  ) {
    return this.searchService.search(query || '', type, Number(limit) || 20, Number(page) || 1, language(lang));
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Language-aware autocomplete suggestions' })
  async suggestions(@Query('q') query: string, @Query('lang') lang?: string) {
    return this.searchService.suggestions(query || '', language(lang));
  }

  @Get('trending')
  @ApiOperation({ summary: 'Trending search queries' })
  async trending() {
    return this.searchService.trending();
  }
}
