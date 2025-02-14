metadata?: Record<string, unknown>; 

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'researcher' | 'user';
  created_at: string;
} 

export interface Content {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  author_id: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  type: ContentType;
  featured_image?: string;
  description?: string;
  metadata?: Record<string, unknown>;
} 