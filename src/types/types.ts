export interface Product {
  id: string
  name: string
  description: string
  features: string[]
  useCases: string[]
}

export interface ResearchProject {
  id: string
  title: string
  category: string
  year: number
  summary: string
}

export type ContentType = 'blog' | 'research' | 'video' | 'podcast';

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

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'researcher' | 'user';
  created_at: string;
  avatar_url?: string;
}

// Add more types as needed

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, unknown>;
}

