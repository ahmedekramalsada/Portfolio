import assert from 'node:assert/strict';
import test from 'node:test';
import { buildFeed, buildSitemap, buildRobots } from './seo.ts';

test('sitemap includes every static locale and reciprocal alternates', () => {
  const xml = buildSitemap('https://ahmedekram.site/', [], []);
  assert.equal((xml.match(/<url>/g) || []).length, 10);
  assert.match(xml, /<loc>https:\/\/ahmedekram.site\/ar<\/loc>/);
  assert.equal((xml.match(/<xhtml:link/g) || []).length, 30);
  assert.match(xml, /xmlns:xhtml="http:\/\/www.w3.org\/1999\/xhtml"/);
  assert.doesNotMatch(xml, /dashboard|login|search/);
});

test('posts have only their real locale; projects have both; XML and dates are safe', () => {
  const xml = buildSitemap('https://ahmedekram.site', [
    { slug: 'english', language: 'en', updated_at: '2026-10-01 12:30:00' },
    { slug: 'عربي', language: 'ar', updated_at: 'invalid' },
  ], [{ slug: 'ahmed-os', updated_at: '2026-10-02T10:00:00Z' }, { slug: 'unsupported-project' }]);
  assert.match(xml, /\/blog\/english/);
  assert.doesNotMatch(xml, /\/ar\/blog\/english/);
  assert.match(xml, /\/ar\/blog\/%D8/);
  assert.match(xml, /<lastmod>2026-10-01T12:30:00.000Z<\/lastmod>/);
  assert.doesNotMatch(xml, /<lastmod>invalid/);
  assert.doesNotMatch(xml, /unsupported-project/);
  assert.equal((xml.match(/<url>/g) || []).length, 14);
  assert.equal((xml.match(/<xhtml:link/g) || []).length, 36);
});

test('feed declares language and self link, escapes content, and omits invalid dates', () => {
  const xml = buildFeed('https://ahmedekram.site', 'ar', [
    { title: 'A & B <C>', slug: 'عربي', excerpt: '"hello" & bye', published_at: 'invalid' },
  ]);
  assert.match(xml, /<language>ar-EG<\/language>/);
  assert.match(xml, /atom:link[^>]+feed.xml\?lang=ar/);
  assert.match(xml, /A &amp; B &lt;C&gt;/);
  assert.match(xml, /\/ar\/blog\/%D8/);
  assert.doesNotMatch(xml, /Invalid Date|<pubDate>/);
});

test('robots leaves resources and noindex login crawlable', () => {
  const robots = buildRobots('https://ahmedekram.site/');
  assert.match(robots, /Disallow: \/api\//);
  assert.doesNotMatch(robots, /Disallow: \/login|Disallow: \/_next/);
  assert.match(robots, /Sitemap: https:\/\/ahmedekram.site\/sitemap.xml/);
});
