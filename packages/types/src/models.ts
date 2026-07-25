export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: PostStatus;
  authorId: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'editor' | 'reader';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';
