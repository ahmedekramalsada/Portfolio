export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  SITE_URL: string;
  R2_PUBLIC_URL: string;
  CONTENT_API_USER_EMAIL: string;
  ALLOWED_ORIGINS: string;
  AUTH_SIGNING_KEY: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  status: string;
  password_hash: string;
}

export interface AuthContext {
  user: UserRecord;
  jti: string;
  expiresAt: number;
}

export interface PostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  language: string;
  coverImage: string | null;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  readingTime: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string } | null;
  category: { id: string; name: string; slug: string } | null;
  tags: Array<{ id: string; name: string; slug: string }>;
}

export interface ProjectRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  coverImage: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  status: string;
  difficulty: string | null;
  role: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  technologies: Array<{ id: string; name: string; slug: string; icon: string | null }>;
}
