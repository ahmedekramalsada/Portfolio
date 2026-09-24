import type { AuthContext, Env, UserRecord } from './types';

const encoder = new TextEncoder();
const PBKDF2_ITERATIONS = 210_000;
const ACCESS_TOKEN_SECONDS = 15 * 60;

function base64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(normalized);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey(env: Env): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(env.AUTH_SIGNING_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function hmacSign(env: Env, value: string): Promise<string> {
  const key = await hmacKey(env);
  return base64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

async function hmacVerify(env: Env, value: string, signature: string): Promise<boolean> {
  const key = await hmacKey(env);
  return crypto.subtle.verify('HMAC', key, base64UrlDecode(signature), encoder.encode(value));
}

async function derivePassword(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await derivePassword(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${base64Url(salt)}$${base64Url(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, iterationsText, saltText, hashText] = stored.split('$');
  if (algorithm !== 'pbkdf2' || !iterationsText || !saltText || !hashText) return false;
  const iterations = Number(iterationsText);
  if (!Number.isSafeInteger(iterations) || iterations < 100_000 || iterations > 2_000_000) return false;
  const expected = base64UrlDecode(hashText);
  const actual = await derivePassword(password, base64UrlDecode(saltText), iterations);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index];
  return difference === 0;
}

interface TokenClaims {
  sub: string;
  email: string;
  role: string;
  jti: string;
  iat: number;
  exp: number;
}

export async function createAccessToken(env: Env, user: UserRecord, jti: string, now = Date.now()): Promise<string> {
  const header = base64Url(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const claims: TokenClaims = {
    sub: user.id,
    email: user.email,
    role: user.role,
    jti,
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + ACCESS_TOKEN_SECONDS,
  };
  const payload = base64Url(encoder.encode(JSON.stringify(claims)));
  const signature = await hmacSign(env, `${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
}

async function verifyAccessToken(env: Env, token: string, now = Date.now()): Promise<TokenClaims | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  if (!(await hmacVerify(env, `${header}.${payload}`, signature))) return null;
  try {
    const claims = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))) as TokenClaims;
    if (!claims.sub || !claims.jti || !claims.exp || claims.exp <= Math.floor(now / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

export async function optionalAuth(env: Env, request: Request): Promise<AuthContext | null> {
  const token = bearerToken(request);
  if (!token) return null;
  const claims = await verifyAccessToken(env, token);
  if (!claims) return null;
  const row = await env.DB.prepare(
    `SELECT u.id, u.email, u.name, u.role, u.avatar, u.status, u.password_hash
       FROM users u JOIN sessions s ON s.user_id = u.id
      WHERE u.id = ?1 AND u.status = 'active' AND s.jti = ?2
        AND s.revoked_at IS NULL AND s.expires_at > datetime('now') LIMIT 1`,
  ).bind(claims.sub, claims.jti).first<UserRecord>();
  if (!row) return null;
  return { user: row, jti: claims.jti, expiresAt: claims.exp * 1000 };
}

export async function requireAuth(env: Env, request: Request): Promise<AuthContext> {
  const context = await optionalAuth(env, request);
  if (!context) throw new HttpError(401, 'Authentication required');
  return context;
}

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export function newId(): string {
  return crypto.randomUUID();
}

export function newToken(): string {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}

export function accessTokenSeconds(): number {
  return ACCESS_TOKEN_SECONDS;
}
