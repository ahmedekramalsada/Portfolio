import { API_BASE_URL } from '@/lib/api-config';

export { API_BASE_URL };

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const origin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
    const base = this.baseUrl.startsWith('http') ? this.baseUrl : `${origin}${this.baseUrl}`;
    const url = new URL(`${base}${path}`);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) =>
        url.searchParams.append(key, String(value))
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>('DELETE', path, undefined, options);
  }
}

export const api = new ApiClient(API_BASE_URL);
