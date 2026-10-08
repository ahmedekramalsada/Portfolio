import assert from 'node:assert/strict';
import test from 'node:test';
import { generatePageMetadata, getJsonLdScript, generateBlogMetadata, blogPageNumber } from './seo.ts';
import { otherLocalePath } from '../lib/site-content.ts';

test('English and Arabic static metadata have reciprocal canonical alternates', () => {
  const en = generatePageMetadata({ path: '/about' });
  const ar = generatePageMetadata({ path: '/ar/about' });
  assert.deepEqual(en.alternates.languages, ar.alternates.languages);
  assert.equal(ar.alternates.canonical, 'https://ahmedekram.site/ar/about');
  assert.equal(ar.openGraph.locale, 'ar_EG');
  assert.equal(en.robots.googleBot.index, true);
});

test('noindex is consistent for every crawler and does not inherit homepage alternates', () => {
  const metadata = generatePageMetadata({ path: '/login', noIndex: true, localized: false });
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.robots.googleBot.index, false);
  assert.equal(metadata.alternates.canonical, 'https://ahmedekram.site/login');
  assert.equal(metadata.alternates.languages, undefined);
});

test('articles have no fabricated translation alternates or broken locale switch', () => {
  assert.equal(generatePageMetadata({ path: '/blog/article' }).alternates.languages, undefined);
  assert.equal(otherLocalePath('en', '/blog/article'), '/ar/blog');
  assert.equal(otherLocalePath('ar', '/ar/blog/article'), '/blog');
  assert.equal(otherLocalePath('en', '/categories/devops'), '/ar/blog');
});

test('JSON-LD serialization cannot terminate its script element', () => {
  const json = JSON.stringify({ title: '</script><script>alert(1)</script>' });
  const html = getJsonLdScript(json).__html;
  assert.doesNotMatch(html, /</);
  assert.deepEqual(JSON.parse(html), JSON.parse(json));
});

test('pagination is self-canonical and localized; filtered search is noindex', () => {
  const en = generateBlogMetadata('en', { page: '2' });
  const ar = generateBlogMetadata('ar', { page: '2' });
  assert.equal(en.alternates.canonical, 'https://ahmedekram.site/blog?page=2');
  assert.deepEqual(en.alternates.languages, ar.alternates.languages);
  assert.equal(en.robots.index, false);
  assert.equal(generateBlogMetadata('en', {}).robots.index, true);
  assert.equal(generateBlogMetadata('en', { q: 'docker' }).robots.googleBot.index, false);
  assert.equal(generateBlogMetadata('ar', { category: 'devops' }).robots.index, false);
  for (const value of ['-1', 'NaN', '2.5', 'Infinity', '10000000000000000000']) assert.equal(blogPageNumber(value), 1);
});
