import { Controller, Get, Param, Res, HttpCode, Header } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { SeoService } from './seo.service';

@Controller()
export class SeoController {
  constructor(private seoService: SeoService) {}

  @Get('sitemap.xml')
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'application/xml')
  async getSitemap() {
    return this.seoService.getSitemap();
  }

  @Get('robots.txt')
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'text/plain')
  async getRobots() {
    return this.seoService.getRobots();
  }

  @Get('feed.xml')
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'application/rss+xml')
  async getRss() {
    return this.seoService.getRss();
  }

  @Get('json-ld/person')
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'application/json')
  async getPersonJsonLd() {
    return this.seoService.getPersonJsonLd();
  }

  @Get('json-ld/website')
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'application/json')
  async getWebsiteJsonLd() {
    return this.seoService.getWebsiteJsonLd();
  }

  @Get('json-ld/blog/:slug')
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'application/json')
  async getBlogPostJsonLd(@Param('slug') slug: string) {
    return this.seoService.getBlogPostJsonLd(slug);
  }

  @Get('json-ld/project/:slug')
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'application/json')
  async getProjectJsonLd(@Param('slug') slug: string) {
    return this.seoService.getProjectJsonLd(slug);
  }

  @Get('json-ld/breadcrumb')
  @ApiExcludeEndpoint()
  @Header('Content-Type', 'application/json')
  async getBreadcrumbJsonLd() {
    return this.seoService.getBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
    ]);
  }
}
