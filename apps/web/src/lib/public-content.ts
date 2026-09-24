import type { Locale } from './site-content';

export const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  language?: string | null;
  readingTime?: number | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  status?: string | null;
  category?: { id?: string; name: string; slug?: string } | null;
  tags?: { id?: string; name: string; slug?: string }[] | null;
  author?: { id?: string; name: string } | null;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  descriptionAr?: string | null;
  content?: string | null;
  contentAr?: string | null;
  coverImage?: string | null;
  role?: string | null;
  difficulty?: string | null;
  featured?: boolean | null;
  status?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  technologies?: { id?: string; name: string; slug?: string }[] | null;
};

export async function getPosts(options: { locale?: Locale; category?: string; page?: number; limit?: number; status?: string } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(options.page || 1));
  params.set('limit', String(options.limit || 20));
  params.set('status', options.status || 'published');
  if (options.locale) params.set('language', options.locale);
  if (options.category && options.category !== 'all') params.set('category', options.category);
  const response = await fetch(`${API_URL}/posts?${params.toString()}`, { next: { revalidate: 60 } });
  if (!response.ok) return { data: [] as Post[], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  return response.json() as Promise<{ data: Post[]; meta: { page: number; limit: number; total: number; totalPages: number } }>;
}

export async function getPost(slug: string, locale: Locale) {
  const response = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
  if (!response.ok) return null;
  const post = (await response.json()) as Post;
  if (post.language && post.language !== locale) return null;
  return post;
}

export async function getProjects() {
  const response = await fetch(`${API_URL}/projects?limit=50`, { next: { revalidate: 60 } });
  if (!response.ok) return [] as Project[];
  const data = await response.json() as { data?: Project[] } | Project[];
  return Array.isArray(data) ? data : data.data || [];
}

export async function getProject(slug: string) {
  const response = await fetch(`${API_URL}/projects/${slug}`, { next: { revalidate: 60 } });
  return response.ok ? (await response.json()) as Project : null;
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`, { next: { revalidate: 300 } });
  if (!response.ok) return [] as { id: string; name: string; slug: string }[];
  return response.json() as Promise<{ id: string; name: string; slug: string }[]>;
}

export function formatDate(value?: string | null, locale: Locale = 'en') {
  if (!value) return '';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function techName(tech: unknown) {
  if (typeof tech === 'string') return tech;
  if (tech && typeof tech === 'object' && 'name' in tech) return String((tech as { name: unknown }).name);
  return '';
}

export function projectInitials(title: string) {
  return title.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}
