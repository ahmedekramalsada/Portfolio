import { HttpError } from './auth';
import type { Env } from './types';

const CORS_HEADERS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

export function text(body: string, status = 200, contentType = 'text/plain; charset=utf-8'): Response {
  return new Response(body, { status, headers: { 'Content-Type': contentType } });
}

export function errorResponse(status: number, message: string): Response {
  return json({ statusCode: status, message }, status);
}

export function isAllowedOrigin(request: Request, env: Env): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  return env.ALLOWED_ORIGINS.split(',').map((item) => item.trim()).filter(Boolean).includes(origin);
}

export function withCors(request: Request, env: Env, response: Response): Response {
  const origin = request.headers.get('Origin');
  if (origin && isAllowedOrigin(request, env)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
  }
  response.headers.set('Access-Control-Allow-Methods', CORS_HEADERS.join(', '));
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function readJson<T>(request: Request, maxBytes = 1_000_000): Promise<T> {
  const declared = request.headers.get('Content-Length');
  if (declared && Number(declared) > maxBytes) throw new HttpError(413, 'Request body is too large');
  const body = await request.text();
  if (body.length > maxBytes) throw new HttpError(413, 'Request body is too large');
  if (!body) return {} as T;
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new HttpError(400, 'Invalid JSON body');
  }
}

export function limitParam(url: URL, fallback = 20, maximum = 100): number {
  const value = Number(url.searchParams.get('limit'));
  return Number.isFinite(value) ? Math.min(Math.max(Math.floor(value), 1), maximum) : fallback;
}

export function pageParam(url: URL): number {
  const value = Number(url.searchParams.get('page'));
  return Number.isFinite(value) ? Math.max(Math.floor(value), 1) : 1;
}

export function requiredString(value: unknown, field: string, max = 10_000): string {
  if (typeof value !== 'string' || !value.trim()) throw new HttpError(400, `${field} is required`);
  const normalized = value.trim();
  if (normalized.length > max) throw new HttpError(400, `${field} is too long`);
  return normalized;
}

export function optionalString(value: unknown, max = 10_000): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new HttpError(400, 'Expected a string value');
  if (value.length > max) throw new HttpError(400, 'Value is too long');
  return value;
}

export function slugValue(value: unknown): string {
  const slug = requiredString(value, 'slug', 160).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new HttpError(400, 'slug must contain lowercase letters, numbers, and hyphens');
  return slug;
}

export function statusValue(value: unknown, allowed: string[], fallback: string): string {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string' || !allowed.includes(value)) throw new HttpError(400, 'Invalid status');
  return value;
}

export function languageValue(value: unknown): string {
  const language = value === undefined || value === null || value === '' ? 'en' : value;
  if (language !== 'en' && language !== 'ar') throw new HttpError(400, 'language must be en or ar');
  return language;
}

export function publicUser(user: { id: string; email: string; name: string; role: string; avatar: string | null }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar };
}

export function jsonDate(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.replace(' ', 'T') + (value.endsWith('Z') ? '' : 'Z');
}
