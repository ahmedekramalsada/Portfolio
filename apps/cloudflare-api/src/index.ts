import {
  accessTokenSeconds,
  createAccessToken,
  hashPassword,
  HttpError,
  newId,
  newToken,
  optionalAuth,
  requireAuth,
  verifyPassword,
} from './auth';
import {
  errorResponse,
  isAllowedOrigin,
  json,
  jsonDate,
  languageValue,
  limitParam,
  optionalString,
  pageParam,
  publicUser,
  readJson,
  requiredString,
  slugValue,
  statusValue,
  text,
  withCors,
} from './http';
import type { Env, PostRecord, ProjectRecord, UserRecord } from './types';

const POST_STATUSES = ['draft', 'scheduled', 'published', 'archived'];
const PROJECT_STATUSES = ['planning', 'in_progress', 'completed', 'archived'];
const POST_PUBLIC_FIELDS = [
  'title', 'slug', 'excerpt', 'content', 'language', 'coverImage', 'status',
  'seoTitle', 'seoDescription', 'canonicalUrl', 'readingTime', 'categoryId',
];
const PROJECT_PUBLIC_FIELDS = [
  'title', 'slug', 'description', 'content', 'coverImage', 'githubUrl', 'demoUrl',
  'featured', 'status', 'difficulty', 'role', 'startDate', 'endDate',
];

type Body = Record<string, unknown>;

function nowIso(): string {
  return new Date().toISOString();
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function boolValue(value: unknown, fallback = false): boolean {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  throw new HttpError(400, 'Expected a boolean value');
}

function numberValue(value: unknown, field: string, minimum = 0, maximum = 100_000): number | null {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) throw new HttpError(400, `${field} is invalid`);
  return Math.floor(number);
}

function isoDate(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === '') return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new HttpError(400, `${field} is invalid`);
  return date.toISOString();
}

function rejectUnknown(body: Body, allowed: string[]): void {
  const unknown = Object.keys(body).filter((key) => !allowed.includes(key));
  if (unknown.length) throw new HttpError(400, `Unknown field: ${unknown[0]}`);
}

function mapPost(row: Record<string, unknown>): PostRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: row.excerpt === null || row.excerpt === undefined ? null : String(row.excerpt),
    content: String(row.content || ''),
    language: String(row.language || 'en'),
    coverImage: row.cover_image === null || row.cover_image === undefined ? null : String(row.cover_image),
    status: String(row.status || 'draft'),
    seoTitle: row.seo_title === null || row.seo_title === undefined ? null : String(row.seo_title),
    seoDescription: row.seo_description === null || row.seo_description === undefined ? null : String(row.seo_description),
    canonicalUrl: row.canonical_url === null || row.canonical_url === undefined ? null : String(row.canonical_url),
    readingTime: row.reading_time === null || row.reading_time === undefined ? null : Number(row.reading_time),
    publishedAt: jsonDate(row.published_at as string | null),
    createdAt: String(row.created_at || nowIso()),
    updatedAt: String(row.updated_at || row.created_at || nowIso()),
    author: row.author_id ? { id: String(row.author_id), name: String(row.author_name || 'Ahmed') } : null,
    category: row.category_id ? { id: String(row.category_id), name: String(row.category_name || ''), slug: String(row.category_slug || '') } : null,
    tags: [],
  };
}

function mapProject(row: Record<string, unknown>): ProjectRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: row.description === null || row.description === undefined ? null : String(row.description),
    content: row.content === null || row.content === undefined ? null : String(row.content),
    coverImage: row.cover_image === null || row.cover_image === undefined ? null : String(row.cover_image),
    githubUrl: row.github_url === null || row.github_url === undefined ? null : String(row.github_url),
    demoUrl: row.demo_url === null || row.demo_url === undefined ? null : String(row.demo_url),
    featured: Boolean(row.featured),
    status: String(row.status || 'planning'),
    difficulty: row.difficulty === null || row.difficulty === undefined ? null : String(row.difficulty),
    role: row.role === null || row.role === undefined ? null : String(row.role),
    startDate: row.start_date === null || row.start_date === undefined ? null : String(row.start_date),
    endDate: row.end_date === null || row.end_date === undefined ? null : String(row.end_date),
    createdAt: String(row.created_at || nowIso()),
    updatedAt: String(row.updated_at || row.created_at || nowIso()),
    technologies: [],
  };
}

async function tagsForPost(env: Env, postId: string) {
  const result = await env.DB.prepare(
    `SELECT t.id, t.name, t.slug FROM tags t JOIN post_tags pt ON pt.tag_id = t.id WHERE pt.post_id = ? ORDER BY t.name`,
  ).bind(postId).all<{ id: string; name: string; slug: string }>();
  return result.results || [];
}

async function technologiesForProject(env: Env, projectId: string) {
  const result = await env.DB.prepare(
    `SELECT t.id, t.name, t.slug, t.icon FROM technologies t JOIN project_technologies pt ON pt.technology_id = t.id WHERE pt.project_id = ? ORDER BY t.name`,
  ).bind(projectId).all<{ id: string; name: string; slug: string; icon: string | null }>();
  return result.results || [];
}

async function postById(env: Env, id: string, allowDeleted = false): Promise<PostRecord> {
  const deleted = allowDeleted ? '' : ' AND p.deleted_at IS NULL';
  const row = await env.DB.prepare(
    `SELECT p.*, u.id AS author_id, u.name AS author_name, c.name AS category_name, c.slug AS category_slug
       FROM posts p JOIN users u ON u.id = p.author_id LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?1${deleted} LIMIT 1`,
  ).bind(id).first<Record<string, unknown>>();
  if (!row) throw new HttpError(404, 'Post not found');
  const post = mapPost(row);
  post.tags = await tagsForPost(env, post.id);
  return post;
}

async function postBySlug(env: Env, slug: string, auth: boolean): Promise<PostRecord | null> {
  const status = auth ? '' : ` AND p.status = 'published'`;
  const row = await env.DB.prepare(
    `SELECT p.*, u.id AS author_id, u.name AS author_name, c.name AS category_name, c.slug AS category_slug
       FROM posts p JOIN users u ON u.id = p.author_id LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ?1 AND p.deleted_at IS NULL${status} LIMIT 1`,
  ).bind(slug).first<Record<string, unknown>>();
  if (!row) return null;
  const post = mapPost(row);
  post.tags = await tagsForPost(env, post.id);
  return post;
}

async function projectById(env: Env, id: string, allowDeleted = false): Promise<ProjectRecord> {
  const deleted = allowDeleted ? '' : ' AND deleted_at IS NULL';
  const row = await env.DB.prepare(`SELECT * FROM projects WHERE id = ?1${deleted} LIMIT 1`).bind(id).first<Record<string, unknown>>();
  if (!row) throw new HttpError(404, 'Project not found');
  const project = mapProject(row);
  project.technologies = await technologiesForProject(env, project.id);
  return project;
}

async function projectBySlug(env: Env, slug: string, auth: boolean): Promise<ProjectRecord | null> {
  const status = auth ? '' : ` AND status NOT IN ('planning', 'archived')`;
  const row = await env.DB.prepare(`SELECT * FROM projects WHERE slug = ?1 AND deleted_at IS NULL${status} LIMIT 1`).bind(slug).first<Record<string, unknown>>();
  if (!row) return null;
  const project = mapProject(row);
  project.technologies = await technologiesForProject(env, project.id);
  return project;
}

async function listPosts(env: Env, request: Request, url: URL, auth: boolean) {
  const page = pageParam(url);
  const limit = limitParam(url);
  const clauses = ['p.deleted_at IS NULL'];
  const values: unknown[] = [];
  const requestedStatus = url.searchParams.get('status');
  if (auth && requestedStatus) {
    clauses.push('p.status = ?');
    values.push(statusValue(requestedStatus, POST_STATUSES, 'draft'));
  } else {
    clauses.push("p.status = 'published'");
  }
  const language = url.searchParams.get('language');
  if (language) {
    if (language !== 'en' && language !== 'ar') throw new HttpError(400, 'language must be en or ar');
    clauses.push('p.language = ?');
    values.push(language);
  }
  const category = url.searchParams.get('category');
  if (category) {
    clauses.push('c.slug = ?');
    values.push(category);
  }
  const categoryId = url.searchParams.get('categoryId');
  if (categoryId) {
    clauses.push('p.category_id = ?');
    values.push(categoryId);
  }
  const where = clauses.join(' AND ');
  const count = await env.DB.prepare(
    `SELECT count(*) AS count FROM posts p LEFT JOIN categories c ON c.id = p.category_id WHERE ${where}`,
  ).bind(...values).first<{ count: number }>();
  const total = Number(count?.count || 0);
  const rows = await env.DB.prepare(
    `SELECT p.*, u.id AS author_id, u.name AS author_name, c.name AS category_name, c.slug AS category_slug
       FROM posts p JOIN users u ON u.id = p.author_id LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${where} ORDER BY COALESCE(p.published_at, p.created_at) DESC LIMIT ? OFFSET ?`,
  ).bind(...values, limit, (page - 1) * limit).all<Record<string, unknown>>();
  const data = await Promise.all((rows.results || []).map(async (row) => {
    const post = mapPost(row);
    post.tags = await tagsForPost(env, post.id);
    return post;
  }));
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function listProjects(env: Env, request: Request, url: URL, auth: boolean) {
  const page = pageParam(url);
  const limit = limitParam(url);
  const clauses = ['deleted_at IS NULL'];
  const values: unknown[] = [];
  const requestedStatus = url.searchParams.get('status');
  if (auth && requestedStatus) {
    clauses.push('status = ?');
    values.push(statusValue(requestedStatus, PROJECT_STATUSES, 'planning'));
  } else if (!auth) {
    clauses.push("status IN ('completed', 'in_progress')");
  }
  const featured = url.searchParams.get('featured');
  if (featured !== null) {
    clauses.push('featured = ?');
    values.push(boolValue(featured) ? 1 : 0);
  }
  const where = clauses.join(' AND ');
  const count = await env.DB.prepare(`SELECT count(*) AS count FROM projects WHERE ${where}`).bind(...values).first<{ count: number }>();
  const total = Number(count?.count || 0);
  const rows = await env.DB.prepare(`SELECT * FROM projects WHERE ${where} ORDER BY featured DESC, created_at DESC LIMIT ? OFFSET ?`).bind(...values, limit, (page - 1) * limit).all<Record<string, unknown>>();
  const data = await Promise.all((rows.results || []).map(async (row) => {
    const project = mapProject(row);
    project.technologies = await technologiesForProject(env, project.id);
    return project;
  }));
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function createPost(env: Env, request: Request) {
  const context = await requireAuth(env, request);
  const body = await readJson<Body>(request);
  rejectUnknown(body, POST_PUBLIC_FIELDS);
  const title = requiredString(body.title, 'title', 300);
  const slug = slugValue(body.slug);
  const content = requiredString(body.content, 'content', 2_000_000);
  const id = newId();
  await env.DB.prepare(
    `INSERT INTO posts (id, title, slug, excerpt, content, language, cover_image, status, seo_title, seo_description, canonical_url, reading_time, published_at, author_id, category_id, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?16)`,
  ).bind(
    id, title, slug, optionalString(body.excerpt, 10_000), content, languageValue(body.language),
    optionalString(body.coverImage, 1_000), statusValue(body.status, POST_STATUSES, 'draft'),
    optionalString(body.seoTitle, 300), optionalString(body.seoDescription, 1_000), optionalString(body.canonicalUrl, 1_000),
    numberValue(body.readingTime, 'readingTime', 1, 10_000), body.status === 'published' ? nowIso() : null,
    context.user.id, optionalString(body.categoryId, 100), nowIso(),
  ).run();
  return postById(env, id, true);
}

async function updatePost(env: Env, request: Request, id: string) {
  const context = await requireAuth(env, request);
  const existing = await postById(env, id, true);
  if (!existing) throw new HttpError(404, 'Post not found');
  const body = await readJson<Body>(request);
  rejectUnknown(body, POST_PUBLIC_FIELDS);
  const assignments: string[] = [];
  const values: unknown[] = [];
  const add = (column: string, value: unknown) => { assignments.push(`${column} = ?`); values.push(value); };
  if ('title' in body) add('title', requiredString(body.title, 'title', 300));
  if ('slug' in body) add('slug', slugValue(body.slug));
  if ('excerpt' in body) add('excerpt', optionalString(body.excerpt, 10_000));
  if ('content' in body) add('content', requiredString(body.content, 'content', 2_000_000));
  if ('language' in body) add('language', languageValue(body.language));
  if ('coverImage' in body) add('cover_image', optionalString(body.coverImage, 1_000));
  if ('status' in body) {
    const status = statusValue(body.status, POST_STATUSES, existing.status);
    add('status', status);
    if (status === 'published') add('published_at', nowIso());
  }
  if ('seoTitle' in body) add('seo_title', optionalString(body.seoTitle, 300));
  if ('seoDescription' in body) add('seo_description', optionalString(body.seoDescription, 1_000));
  if ('canonicalUrl' in body) add('canonical_url', optionalString(body.canonicalUrl, 1_000));
  if ('readingTime' in body) add('reading_time', numberValue(body.readingTime, 'readingTime', 1, 10_000));
  if ('categoryId' in body) add('category_id', optionalString(body.categoryId, 100));
  if (assignments.length) {
    assignments.push('updated_at = CURRENT_TIMESTAMP');
    await env.DB.prepare(`UPDATE posts SET ${assignments.join(', ')} WHERE id = ?`).bind(...values, id).run();
  }
  void context;
  return postById(env, id, true);
}

async function deletePost(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  const existing = await postById(env, id);
  await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(existing.id).run();
  return { message: 'Post deleted' };
}

async function publishPost(env: Env, request: Request, id: string, archive = false) {
  await requireAuth(env, request);
  const post = await postById(env, id, true);
  await env.DB.prepare('UPDATE posts SET status = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(archive ? 'archived' : 'published', archive ? post.publishedAt : nowIso(), id).run();
  return postById(env, id, true);
}

async function createProject(env: Env, request: Request) {
  await requireAuth(env, request);
  const body = await readJson<Body>(request);
  rejectUnknown(body, [...PROJECT_PUBLIC_FIELDS, 'technologies']);
  const id = newId();
  await env.DB.prepare(
    `INSERT INTO projects (id, title, slug, description, content, cover_image, github_url, demo_url, featured, status, difficulty, role, start_date, end_date, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?15)`,
  ).bind(
    id, requiredString(body.title, 'title', 300), slugValue(body.slug), optionalString(body.description, 10_000), optionalString(body.content, 2_000_000),
    optionalString(body.coverImage, 1_000), optionalString(body.githubUrl, 1_000), optionalString(body.demoUrl, 1_000), boolValue(body.featured) ? 1 : 0,
    statusValue(body.status, PROJECT_STATUSES, 'planning'), optionalString(body.difficulty, 100), optionalString(body.role, 200), isoDate(body.startDate, 'startDate'), isoDate(body.endDate, 'endDate'), nowIso(),
  ).run();
  return projectById(env, id, true);
}

async function updateProject(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  const existing = await projectById(env, id, true);
  const body = await readJson<Body>(request);
  rejectUnknown(body, [...PROJECT_PUBLIC_FIELDS, 'technologies']);
  const assignments: string[] = [];
  const values: unknown[] = [];
  const add = (column: string, value: unknown) => { assignments.push(`${column} = ?`); values.push(value); };
  if ('title' in body) add('title', requiredString(body.title, 'title', 300));
  if ('slug' in body) add('slug', slugValue(body.slug));
  if ('description' in body) add('description', optionalString(body.description, 10_000));
  if ('content' in body) add('content', optionalString(body.content, 2_000_000));
  if ('coverImage' in body) add('cover_image', optionalString(body.coverImage, 1_000));
  if ('githubUrl' in body) add('github_url', optionalString(body.githubUrl, 1_000));
  if ('demoUrl' in body) add('demo_url', optionalString(body.demoUrl, 1_000));
  if ('featured' in body) add('featured', boolValue(body.featured) ? 1 : 0);
  if ('status' in body) add('status', statusValue(body.status, PROJECT_STATUSES, existing.status));
  if ('difficulty' in body) add('difficulty', optionalString(body.difficulty, 100));
  if ('role' in body) add('role', optionalString(body.role, 200));
  if ('startDate' in body) add('start_date', isoDate(body.startDate, 'startDate'));
  if ('endDate' in body) add('end_date', isoDate(body.endDate, 'endDate'));
  if (assignments.length) {
    assignments.push('updated_at = CURRENT_TIMESTAMP');
    await env.DB.prepare(`UPDATE projects SET ${assignments.join(', ')} WHERE id = ?`).bind(...values, id).run();
  }
  return projectById(env, id, true);
}

async function deleteProject(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  const existing = await projectById(env, id);
  await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(existing.id).run();
  return { message: 'Project deleted' };
}

async function listCategories(env: Env) {
  const result = await env.DB.prepare('SELECT id, name, slug, description, color, created_at, updated_at FROM categories ORDER BY name').all<Record<string, unknown>>();
  return (result.results || []).map((row) => ({
    id: String(row.id), name: String(row.name), slug: String(row.slug), description: row.description ? String(row.description) : null, color: row.color ? String(row.color) : null,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  }));
}

async function listSkills(env: Env) {
  const result = await env.DB.prepare('SELECT id, name, category, level, icon FROM skills ORDER BY level DESC, name').all<Record<string, unknown>>();
  return (result.results || []).map((row) => ({ id: String(row.id), name: String(row.name), category: row.category ? String(row.category) : null, level: row.level === null ? null : Number(row.level), icon: row.icon ? String(row.icon) : null }));
}

async function createSkill(env: Env, request: Request) {
  await requireAuth(env, request);
  const body = await readJson<Body>(request);
  rejectUnknown(body, ['name', 'category', 'level', 'icon']);
  const id = newId();
  await env.DB.prepare('INSERT INTO skills (id, name, category, level, icon, created_at, updated_at) VALUES (?1,?2,?3,?4,?5,?6,?6)')
    .bind(id, requiredString(body.name, 'name', 120), optionalString(body.category, 120), numberValue(body.level, 'level', 1, 10), optionalString(body.icon, 100), nowIso()).run();
  return (await listSkills(env)).find((row) => row.id === id);
}

async function updateSkill(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  const body = await readJson<Body>(request);
  rejectUnknown(body, ['name', 'category', 'level', 'icon']);
  const current = await env.DB.prepare('SELECT id FROM skills WHERE id = ?').bind(id).first();
  if (!current) throw new HttpError(404, 'Skill not found');
  const assignments: string[] = []; const values: unknown[] = [];
  const add = (column: string, value: unknown) => { assignments.push(`${column} = ?`); values.push(value); };
  if ('name' in body) add('name', requiredString(body.name, 'name', 120));
  if ('category' in body) add('category', optionalString(body.category, 120));
  if ('level' in body) add('level', numberValue(body.level, 'level', 1, 10));
  if ('icon' in body) add('icon', optionalString(body.icon, 100));
  if (assignments.length) { assignments.push('updated_at = CURRENT_TIMESTAMP'); await env.DB.prepare(`UPDATE skills SET ${assignments.join(', ')} WHERE id = ?`).bind(...values, id).run(); }
  return (await listSkills(env)).find((row) => row.id === id);
}

async function deleteSkill(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  const result = await env.DB.prepare('DELETE FROM skills WHERE id = ?').bind(id).run();
  if (!result.meta?.changes) throw new HttpError(404, 'Skill not found');
  return { message: 'Skill deleted' };
}

async function listExperiences(env: Env) {
  const result = await env.DB.prepare('SELECT id, company, position, start_date, end_date, description FROM experiences ORDER BY start_date DESC').all<Record<string, unknown>>();
  return (result.results || []).map((row) => ({ id: String(row.id), company: String(row.company), position: String(row.position), startDate: String(row.start_date), endDate: row.end_date ? String(row.end_date) : null, description: row.description ? String(row.description) : null }));
}

async function createCategory(env: Env, request: Request) {
  await requireAuth(env, request);
  const body = await readJson<Body>(request);
  rejectUnknown(body, ['name', 'slug', 'description', 'color']);
  const id = newId();
  await env.DB.prepare('INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES (?1,?2,?3,?4,?5,?6,?6)')
    .bind(id, requiredString(body.name, 'name', 120), slugValue(body.slug), optionalString(body.description, 1_000), optionalString(body.color, 50), nowIso()).run();
  return (await listCategories(env)).find((row) => row.id === id);
}

async function updateCategory(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  const body = await readJson<Body>(request);
  rejectUnknown(body, ['name', 'slug', 'description', 'color']);
  const current = await env.DB.prepare('SELECT id FROM categories WHERE id = ?').bind(id).first();
  if (!current) throw new HttpError(404, 'Category not found');
  const assignments: string[] = []; const values: unknown[] = [];
  const add = (column: string, value: unknown) => { assignments.push(`${column} = ?`); values.push(value); };
  if ('name' in body) add('name', requiredString(body.name, 'name', 120));
  if ('slug' in body) add('slug', slugValue(body.slug));
  if ('description' in body) add('description', optionalString(body.description, 1_000));
  if ('color' in body) add('color', optionalString(body.color, 50));
  if (assignments.length) { assignments.push('updated_at = CURRENT_TIMESTAMP'); await env.DB.prepare(`UPDATE categories SET ${assignments.join(', ')} WHERE id = ?`).bind(...values, id).run(); }
  return (await listCategories(env)).find((row) => row.id === id);
}

async function deleteCategory(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  const current = await env.DB.prepare('SELECT id FROM categories WHERE id = ?').bind(id).first();
  if (!current) throw new HttpError(404, 'Category not found');
  const inUse = await env.DB.prepare('SELECT 1 AS used FROM posts WHERE category_id = ? AND deleted_at IS NULL LIMIT 1').bind(id).first();
  if (inUse) throw new HttpError(409, 'Category is used by one or more posts');
  await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
  return { message: 'Category deleted' };
}

async function createExperience(env: Env, request: Request) {
  await requireAuth(env, request);
  const body = await readJson<Body>(request);
  rejectUnknown(body, ['company', 'position', 'startDate', 'endDate', 'description']);
  const id = newId();
  await env.DB.prepare('INSERT INTO experiences (id, company, position, start_date, end_date, description, created_at, updated_at) VALUES (?1,?2,?3,?4,?5,?6,?7,?7)')
    .bind(id, requiredString(body.company, 'company', 200), requiredString(body.position, 'position', 200), isoDate(body.startDate || nowIso(), 'startDate'), isoDate(body.endDate, 'endDate'), optionalString(body.description, 10_000), nowIso()).run();
  return (await listExperiences(env)).find((row) => row.id === id);
}

async function updateExperience(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  const body = await readJson<Body>(request);
  rejectUnknown(body, ['company', 'position', 'startDate', 'endDate', 'description']);
  const current = await env.DB.prepare('SELECT id FROM experiences WHERE id = ?').bind(id).first();
  if (!current) throw new HttpError(404, 'Experience not found');
  const assignments: string[] = []; const values: unknown[] = [];
  const add = (column: string, value: unknown) => { assignments.push(`${column} = ?`); values.push(value); };
  if ('company' in body) add('company', requiredString(body.company, 'company', 200));
  if ('position' in body) add('position', requiredString(body.position, 'position', 200));
  if ('startDate' in body) add('start_date', isoDate(body.startDate, 'startDate'));
  if ('endDate' in body) add('end_date', isoDate(body.endDate, 'endDate'));
  if ('description' in body) add('description', optionalString(body.description, 10_000));
  if (assignments.length) { assignments.push('updated_at = CURRENT_TIMESTAMP'); await env.DB.prepare(`UPDATE experiences SET ${assignments.join(', ')} WHERE id = ?`).bind(...values, id).run(); }
  return (await listExperiences(env)).find((row) => row.id === id);
}

async function deleteExperience(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  await env.DB.prepare('DELETE FROM experiences WHERE id = ?').bind(id).run();
  return { message: 'Experience deleted' };
}

async function listSettings(env: Env, publicOnly = false) {
  const where = publicOnly ? 'WHERE public = 1' : '';
  const result = await env.DB.prepare(`SELECT id, key, value, group_name, type, public, created_at, updated_at FROM settings ${where} ORDER BY key`).all<Record<string, unknown>>();
  return (result.results || []).map((row) => ({ id: String(row.id), key: String(row.key), value: String(row.value), group: row.group_name ? String(row.group_name) : null, type: row.type ? String(row.type) : 'string', public: Boolean(row.public), createdAt: String(row.created_at), updatedAt: String(row.updated_at) }));
}

async function updateSettings(env: Env, request: Request) {
  await requireAuth(env, request);
  const body = await readJson<{ settings?: unknown }>(request, 100_000);
  if (!Array.isArray(body.settings)) throw new HttpError(400, 'settings must be an array');
  const seen = new Set<string>();
  for (const item of body.settings) {
    if (!item || typeof item !== 'object') throw new HttpError(400, 'Each setting must be an object');
    const record = item as Record<string, unknown>;
    const key = requiredString(record.key, 'key', 120);
    if (seen.has(key)) throw new HttpError(400, `Duplicate setting: ${key}`);
    seen.add(key);
    const value = String(record.value ?? '');
    if (value.length > 100_000) throw new HttpError(400, 'Setting value is too long');
    const group = optionalString(record.group, 120);
    const type = optionalString(record.type, 40) || 'string';
    const isPublic = boolValue(record.public);
    const current = await env.DB.prepare('SELECT id FROM settings WHERE key = ?').bind(key).first();
    if (current) {
      await env.DB.prepare('UPDATE settings SET value = ?, group_name = ?, type = ?, public = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?').bind(value, group, type, isPublic ? 1 : 0, key).run();
    } else {
      const id = newId();
      await env.DB.prepare('INSERT INTO settings (id, key, value, group_name, type, public, created_at, updated_at) VALUES (?1,?2,?3,?4,?5,?6,?7,?7)').bind(id, key, value, group, type, isPublic ? 1 : 0, nowIso()).run();
    }
  }
  return listSettings(env);
}

async function listMedia(env: Env, request: Request, url: URL) {
  await requireAuth(env, request);
  const limit = limitParam(url, 50, 100);
  const projectId = url.searchParams.get('projectId');
  const values: unknown[] = [];
  let where = 'deleted_at IS NULL';
  if (projectId) { where += ' AND project_id = ?'; values.push(projectId); }
  const count = await env.DB.prepare(`SELECT count(*) AS count FROM media WHERE ${where}`).bind(...values).first<{ count: number }>();
  const result = await env.DB.prepare(`SELECT id, filename, original_name, mime_type, size, width, height, provider, path, public_url, project_id, uploaded_by, created_at, updated_at FROM media WHERE ${where} ORDER BY created_at DESC LIMIT ?`).bind(...values, limit).all<Record<string, unknown>>();
  const data = (result.results || []).map((row) => ({ id: String(row.id), filename: String(row.filename), originalName: String(row.original_name), mimeType: String(row.mime_type), size: Number(row.size), width: row.width ? Number(row.width) : null, height: row.height ? Number(row.height) : null, provider: String(row.provider), path: String(row.path), publicUrl: row.public_url ? String(row.public_url) : null, projectId: row.project_id ? String(row.project_id) : null, uploadedBy: row.uploaded_by ? String(row.uploaded_by) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at) }));
  return { data, meta: { limit, total: Number(count?.count || 0) } };
}

async function uploadMedia(env: Env, request: Request) {
  const context = await requireAuth(env, request);
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 11_000_000) throw new HttpError(413, 'File is too large (maximum 10 MB)');
  let form: FormData;
  try { form = await request.formData(); } catch { throw new HttpError(400, 'Expected multipart/form-data'); }
  const value = form.get('file');
  if (!(value instanceof File)) throw new HttpError(400, 'file is required');
  if (value.size <= 0 || value.size > 10 * 1024 * 1024) throw new HttpError(400, 'File is too large or empty (maximum 10 MB)');
  const safeName = value.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180) || 'file';
  const key = `media/${newId()}-${safeName}`;
  const publicUrl = `${env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
  await env.MEDIA.put(key, value.stream(), { httpMetadata: { contentType: value.type || 'application/octet-stream' } });
  const id = newId();
  await env.DB.prepare('INSERT INTO media (id, filename, original_name, mime_type, size, provider, path, public_url, uploaded_by, created_at, updated_at) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?10)')
    .bind(id, safeName, value.name, value.type || 'application/octet-stream', value.size, 'r2', key, publicUrl, context.user.id, nowIso()).run();
  return { id, filename: safeName, originalName: value.name, mimeType: value.type || 'application/octet-stream', size: value.size, provider: 'r2', path: key, publicUrl, projectId: null, createdAt: nowIso(), updatedAt: nowIso() };
}

async function updateMedia(env: Env, request: Request, id: string) {
  const context = await requireAuth(env, request);
  const body = await readJson<Body>(request);
  rejectUnknown(body, ['projectId']);
  if ('projectId' in body) await env.DB.prepare('UPDATE media SET project_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(optionalString(body.projectId, 100), id).run();
  void context;
  const result = await env.DB.prepare('SELECT id, filename, original_name, mime_type, size, provider, path, public_url, project_id, created_at, updated_at FROM media WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!result) throw new HttpError(404, 'Media not found');
  return { id: String(result.id), filename: String(result.filename), originalName: String(result.original_name), mimeType: String(result.mime_type), size: Number(result.size), provider: String(result.provider), path: String(result.path), publicUrl: result.public_url ? String(result.public_url) : null, projectId: result.project_id ? String(result.project_id) : null, createdAt: String(result.created_at), updatedAt: String(result.updated_at) };
}

async function deleteMedia(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  const row = await env.DB.prepare('SELECT path FROM media WHERE id = ? AND deleted_at IS NULL').bind(id).first<{ path: string }>();
  if (!row) throw new HttpError(404, 'Media not found');
  await env.MEDIA.delete(row.path);
  await env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run();
  return { message: 'Deleted' };
}

async function createContact(env: Env, request: Request) {
  const body = await readJson<Body>(request, 20_000);
  rejectUnknown(body, ['name', 'email', 'subject', 'message', 'website']);
  if (typeof body.website === 'string' && body.website.trim()) throw new HttpError(400, 'Unable to submit this message');
  const name = requiredString(body.name, 'name', 120);
  const email = requiredString(body.email, 'email', 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'email is invalid');
  const message = requiredString(body.message, 'message', 10_000);
  if (message.length < 10) throw new HttpError(400, 'message is too short');
  const subject = optionalString(body.subject, 160);
  const id = newId();
  const ip = request.headers.get('CF-Connecting-IP');
  await env.DB.prepare('INSERT INTO contacts (id, name, email, subject, message, ip, created_at) VALUES (?1,?2,?3,?4,?5,?6,?7)').bind(id, name, email, subject, message, ip, nowIso()).run();
  return { id, name, email, subject, message, createdAt: nowIso() };
}

async function listContacts(env: Env, request: Request, url: URL) {
  await requireAuth(env, request);
  const limit = limitParam(url, 100, 100);
  const result = await env.DB.prepare('SELECT id, name, email, subject, message, read, created_at FROM contacts ORDER BY created_at DESC LIMIT ?').bind(limit).all<Record<string, unknown>>();
  return (result.results || []).map((row) => ({ id: String(row.id), name: String(row.name), email: String(row.email), subject: row.subject ? String(row.subject) : null, message: String(row.message), read: Boolean(row.read), createdAt: String(row.created_at) }));
}

async function deleteContact(env: Env, request: Request, id: string) {
  await requireAuth(env, request);
  await env.DB.prepare('DELETE FROM contacts WHERE id = ?').bind(id).run();
  return { message: 'Deleted' };
}

async function search(env: Env, request: Request, url: URL) {
  const query = cleanText(url.searchParams.get('q') || '');
  const page = pageParam(url);
  const limit = limitParam(url, 20, 50);
  const language = url.searchParams.get('lang') || url.searchParams.get('language') || '';
  const type = url.searchParams.get('type') || '';
  if (language && language !== 'en' && language !== 'ar') throw new HttpError(400, 'language must be en or ar');
  if (!query) return { data: [], meta: { page, limit, total: 0, totalPages: 0 } };
  const like = `%${query.replace(/[\\%_]/g, '\\$&')}%`;
  const postWhere = ["deleted_at IS NULL", "status = 'published'", 'lower(title) LIKE lower(?) ESCAPE \'\\\''];
  const projectWhere = ["deleted_at IS NULL", "status IN ('completed', 'in_progress')", "lower(title) LIKE lower(?) ESCAPE '\\'"];
  const results: Array<Record<string, unknown>> = [];
  if (!type || type === 'posts' || type === 'post') {
    const rows = await env.DB.prepare(`SELECT id, title, slug, excerpt, language, 'post' AS type FROM posts WHERE ${postWhere.join(' AND ')} ${language ? 'AND language = ?' : ''} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...(language ? [like, language, limit, (page - 1) * limit] : [like, limit, (page - 1) * limit])).all<Record<string, unknown>>();
    results.push(...(rows.results || []).map((row) => ({ ...row, excerpt: row.excerpt ? String(row.excerpt) : null, language: row.language ? String(row.language) : null })));
  }
  if (!type || type === 'projects' || type === 'project') {
    const rows = await env.DB.prepare(`SELECT id, title, slug, description AS excerpt, NULL AS language, 'project' AS type FROM projects WHERE ${projectWhere.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(like, limit, (page - 1) * limit).all<Record<string, unknown>>();
    results.push(...(rows.results || []).map((row) => ({ ...row, excerpt: row.excerpt ? String(row.excerpt) : null })));
  }
  const offset = results.slice((page - 1) * limit, page * limit);
  return { data: offset, meta: { page, limit, total: offset.length, totalPages: offset.length ? 1 : 0 } };
}

function xmlEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function sitemap(env: Env) {
  const site = env.SITE_URL.replace(/\/$/, '');
  const entries: string[] = [
    ['', 'daily', '1.0'], ['/about', 'monthly', '0.8'], ['/ar/about', 'monthly', '0.8'], ['/blog', 'daily', '0.9'], ['/ar/blog', 'daily', '0.9'], ['/projects', 'weekly', '0.9'], ['/ar/projects', 'weekly', '0.9'], ['/contact', 'monthly', '0.7'], ['/ar/contact', 'monthly', '0.7'],
  ].map(([path, frequency, priority]) => `<url><loc>${xmlEscape(site + path)}</loc><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`);
  const posts = await env.DB.prepare("SELECT slug, language, updated_at FROM posts WHERE status = 'published' AND deleted_at IS NULL").all<{ slug: string; language: string; updated_at: string }>();
  for (const post of posts.results || []) entries.push(`<url><loc>${xmlEscape(`${site}${post.language === 'ar' ? '/ar/blog' : '/blog'}/${post.slug}`)}</loc><lastmod>${xmlEscape(post.updated_at)}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
  const projects = await env.DB.prepare("SELECT slug FROM projects WHERE status IN ('completed', 'in_progress') AND deleted_at IS NULL").all<{ slug: string }>();
  for (const project of projects.results || []) entries.push(`<url><loc>${xmlEscape(`${site}/projects/${project.slug}`)}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url><url><loc>${xmlEscape(`${site}/ar/projects/${project.slug}`)}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`;
}

async function feed(env: Env, url: URL) {
  const language = url.searchParams.get('lang') === 'ar' ? 'ar' : 'en';
  const site = env.SITE_URL.replace(/\/$/, '');
  const result = await env.DB.prepare("SELECT title, slug, excerpt, content, published_at, updated_at FROM posts WHERE status = 'published' AND deleted_at IS NULL AND language = ? ORDER BY COALESCE(published_at, created_at) DESC LIMIT 50").bind(language).all<Record<string, unknown>>();
  const items = (result.results || []).map((post) => {
    const path = `${language === 'ar' ? '/ar/blog' : '/blog'}/${String(post.slug)}`;
    const urlItem = `${site}${path}`;
    const date = new Date(String(post.published_at || post.updated_at)).toUTCString();
    return `<item><title>${xmlEscape(String(post.title))}</title><link>${xmlEscape(urlItem)}</link><guid isPermaLink="true">${xmlEscape(urlItem)}</guid><pubDate>${xmlEscape(date)}</pubDate>${post.excerpt ? `<description>${xmlEscape(String(post.excerpt))}</description>` : ''}</item>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ahmed Ekram Alsada</title><link>${xmlEscape(site)}</link><description>DevOps, cloud infrastructure, and practical AI systems.</description>${items}</channel></rss>`;
}

function jsonLdPerson(site: string) {
  return { '@context': 'https://schema.org', '@type': 'Person', name: 'Ahmed Ekram Alsada', alternateName: 'أحمد أكرم السادة', url: site, jobTitle: 'DevOps Engineer', workLocation: { '@type': 'Place', name: 'Cairo, Egypt' }, knowsLanguage: ['Arabic', 'English'] };
}

async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const rawPath = url.pathname;
  const method = request.method.toUpperCase();
  if (method === 'OPTIONS') return new Response(null, { status: 204 });
  if (!isAllowedOrigin(request, env)) return errorResponse(403, 'Origin is not allowed');

  if (rawPath === '/health' || rawPath === '/api/v1/health') return json({ status: 'ok', service: 'ahmed-os-api' });
  if (rawPath === '/robots.txt') return text(`User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /login\nSitemap: ${env.SITE_URL.replace(/\/$/, '')}/sitemap.xml\n`);
  if (rawPath === '/sitemap.xml') return text(await sitemap(env), 200, 'application/xml; charset=utf-8');
  if (rawPath === '/feed.xml') return text(await feed(env, url), 200, 'application/rss+xml; charset=utf-8');
  if (rawPath === '/json-ld/person') return json(jsonLdPerson(env.SITE_URL.replace(/\/$/, '')));
  if (rawPath === '/json-ld/website') return json({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Ahmed Ekram Alsada', url: env.SITE_URL, inLanguage: ['en-US', 'ar-EG'] });

  const path = rawPath.replace(/^\/api\/v1/, '') || '/';
  const segments = path.split('/').filter(Boolean);

  if (path === '/auth/login' && method === 'POST') {
    const body = await readJson<{ email?: unknown; password?: unknown }>(request, 10_000);
    const email = requiredString(body.email, 'email', 254).toLowerCase();
    const password = requiredString(body.password, 'password', 1_000);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) throw new HttpError(400, 'Invalid email or password');
    const user = await env.DB.prepare('SELECT id, email, name, role, avatar, status, password_hash FROM users WHERE lower(email) = ? LIMIT 1').bind(email).first<UserRecord>();
    if (!user || user.status !== 'active' || !(await verifyPassword(password, user.password_hash))) throw new HttpError(401, 'Invalid credentials');
    const jti = newToken();
    const expires = new Date(Date.now() + accessTokenSeconds() * 1000).toISOString();
    await env.DB.prepare('INSERT INTO sessions (id, user_id, jti, expires_at, created_at) VALUES (?1,?2,?3,?4,?5)').bind(newId(), user.id, jti, expires, nowIso()).run();
    await env.DB.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(user.id).run();
    return json({ accessToken: await createAccessToken(env, user, jti), expiresIn: accessTokenSeconds(), user: publicUser(user) });
  }
  if (path === '/auth/me' && method === 'GET') {
    const context = await requireAuth(env, request);
    return json(publicUser(context.user));
  }
  if (path === '/auth/logout' && method === 'POST') {
    const context = await requireAuth(env, request);
    await env.DB.prepare('UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE jti = ? AND user_id = ?').bind(context.jti, context.user.id).run();
    return json({ message: 'Logged out' });
  }
  if (path === '/auth/change-password' && method === 'POST') {
    const context = await requireAuth(env, request);
    const body = await readJson<{ currentPassword?: unknown; newPassword?: unknown }>(request, 20_000);
    const currentPassword = requiredString(body.currentPassword, 'currentPassword', 1_000);
    const newPassword = requiredString(body.newPassword, 'newPassword', 1_000);
    if (newPassword.length < 12) throw new HttpError(400, 'newPassword must be at least 12 characters');
    if (!(await verifyPassword(currentPassword, context.user.password_hash))) throw new HttpError(401, 'Current password is incorrect');
    const passwordHash = await hashPassword(newPassword);
    await env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(passwordHash, context.user.id).run();
    await env.DB.prepare('UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND jti != ?').bind(context.user.id, context.jti).run();
    return json({ message: 'Password changed' });
  }

  if (path === '/posts' && method === 'GET') return json(await listPosts(env, request, url, Boolean(await optionalAuth(env, request))));
  if (path === '/posts' && method === 'POST') return json(await createPost(env, request), 201);
  if (segments[0] === 'posts' && segments[1] && method === 'GET') {
    const post = await postBySlug(env, segments[1], Boolean(await optionalAuth(env, request)));
    return post ? json(post) : errorResponse(404, 'Post not found');
  }
  if (segments[0] === 'posts' && segments[1] && method === 'PATCH') return json(await updatePost(env, request, segments[1]));
  if (segments[0] === 'posts' && segments[1] && method === 'DELETE') return json(await deletePost(env, request, segments[1]));
  if (segments[0] === 'posts' && segments[1] && segments[2] === 'publish' && method === 'POST') return json(await publishPost(env, request, segments[1]));
  if (segments[0] === 'posts' && segments[1] && segments[2] === 'archive' && method === 'POST') return json(await publishPost(env, request, segments[1], true));

  if (path === '/projects' && method === 'GET') return json(await listProjects(env, request, url, Boolean(await optionalAuth(env, request))));
  if (path === '/projects' && method === 'POST') return json(await createProject(env, request), 201);
  if (segments[0] === 'projects' && segments[1] && method === 'GET') {
    const project = await projectBySlug(env, segments[1], Boolean(await optionalAuth(env, request)));
    return project ? json(project) : errorResponse(404, 'Project not found');
  }
  if (segments[0] === 'projects' && segments[1] && method === 'PATCH') return json(await updateProject(env, request, segments[1]));
  if (segments[0] === 'projects' && segments[1] && method === 'DELETE') return json(await deleteProject(env, request, segments[1]));

  if (path === '/categories' && method === 'GET') return json(await listCategories(env));
  if (path === '/categories' && method === 'POST') return json(await createCategory(env, request), 201);
  if (segments[0] === 'categories' && segments[1] && method === 'PATCH') return json(await updateCategory(env, request, segments[1]));
  if (segments[0] === 'categories' && segments[1] && method === 'DELETE') return json(await deleteCategory(env, request, segments[1]));
  if (path === '/skills' && method === 'GET') return json(await listSkills(env));
  if (path === '/skills' && method === 'POST') return json(await createSkill(env, request), 201);
  if (segments[0] === 'skills' && segments[1] && method === 'PATCH') return json(await updateSkill(env, request, segments[1]));
  if (segments[0] === 'skills' && segments[1] && method === 'DELETE') return json(await deleteSkill(env, request, segments[1]));
  if (path === '/experiences' && method === 'GET') return json(await listExperiences(env));
  if (path === '/experiences' && method === 'POST') return json(await createExperience(env, request), 201);
  if (segments[0] === 'experiences' && segments[1] && method === 'PATCH') return json(await updateExperience(env, request, segments[1]));
  if (segments[0] === 'experiences' && segments[1] && method === 'DELETE') return json(await deleteExperience(env, request, segments[1]));
  if (path === '/settings' && method === 'GET') return json(await listSettings(env, Boolean(await optionalAuth(env, request))));
  if (path === '/settings' && method === 'PATCH') return json(await updateSettings(env, request));
  if (path === '/media' && method === 'GET') return json(await listMedia(env, request, url));
  if (path === '/media/upload' && method === 'POST') return json(await uploadMedia(env, request), 201);
  if (segments[0] === 'media' && segments[1] && method === 'PATCH') return json(await updateMedia(env, request, segments[1]));
  if (segments[0] === 'media' && segments[1] && method === 'DELETE') return json(await deleteMedia(env, request, segments[1]));
  if (path === '/contacts' && method === 'POST') return json(await createContact(env, request), 201);
  if (path === '/contacts' && method === 'GET') return json(await listContacts(env, request, url));
  if (segments[0] === 'contacts' && segments[1] && method === 'DELETE') return json(await deleteContact(env, request, segments[1]));
  if (path === '/search' && method === 'GET') return json(await search(env, request, url));

  return errorResponse(404, 'Not found');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    let response: Response;
    try {
      response = await route(request, env);
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      const message = error instanceof Error ? error.message : 'Internal server error';
      console.error(JSON.stringify({ event: 'request_error', status, message }));
      response = errorResponse(status, status === 500 ? 'Internal server error' : message);
    }
    response = withCors(request, env, response);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Cache-Control', 'no-store');
    return response;
  },
} satisfies ExportedHandler<Env>;
