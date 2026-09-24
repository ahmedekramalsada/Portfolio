import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE } from '@/lib/auth-cookie';
import { SERVER_API_URL } from '@/lib/api-config';

type RouteContext = { params: Promise<{ path?: string[] }> };
type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

function cookieValue(token: string, maxAge: number) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

function responseHeaders(source: Headers) {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (!['content-length', 'transfer-encoding', 'set-cookie', 'content-encoding'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return headers;
}

async function forward(request: Request, context: RouteContext, method: HttpMethod) {
  const { path = [] } = await context.params;
  if (path.some((segment) => segment === '.' || segment === '..' || !segment)) {
    return new Response('Bad Request', { status: 400 });
  }

  const apiPath = path[0] === 'v1' ? path.slice(1) : path;
  if (!apiPath.length) return new Response('Bad Request', { status: 400 });
  const target = new URL(`${SERVER_API_URL}/${apiPath.map((segment) => encodeURIComponent(segment)).join('/')}`);
  target.search = new URL(request.url).search;
  const headers = new Headers();
  for (const name of ['accept', 'accept-language', 'content-type', 'user-agent']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  const routeName = apiPath.join('/');
  if (token && routeName !== 'auth/login') headers.set('Authorization', `Bearer ${token}`);

  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer();
  const upstream = await fetch(target, { method, headers, body, cache: 'no-store' });
  const headersOut = responseHeaders(upstream.headers);
  const text = await upstream.text();

  if (routeName === 'auth/login' && upstream.ok) {
    try {
      const payload = JSON.parse(text) as { accessToken?: string };
      const token = payload.accessToken;
      if (token) {
        delete payload.accessToken;
        headersOut.set('Set-Cookie', cookieValue(token, ACCESS_TOKEN_MAX_AGE));
        return new Response(JSON.stringify(payload), { status: upstream.status, headers: headersOut });
      }
    } catch {
      // Return the upstream response unchanged if it is not JSON.
    }
  }

  if (routeName === 'auth/logout' && upstream.ok) {
    headersOut.set('Set-Cookie', cookieValue('', 0));
  }

  return new Response(text, { status: upstream.status, headers: headersOut });
}

export async function GET(request: Request, context: RouteContext) {
  return forward(request, context, 'GET');
}

export async function HEAD(request: Request, context: RouteContext) {
  return forward(request, context, 'HEAD');
}

export async function POST(request: Request, context: RouteContext) {
  return forward(request, context, 'POST');
}

export async function PUT(request: Request, context: RouteContext) {
  return forward(request, context, 'PUT');
}

export async function PATCH(request: Request, context: RouteContext) {
  return forward(request, context, 'PATCH');
}

export async function DELETE(request: Request, context: RouteContext) {
  return forward(request, context, 'DELETE');
}

export async function OPTIONS(request: Request, context: RouteContext) {
  return forward(request, context, 'OPTIONS');
}
