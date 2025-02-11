export type UserRole = 'user' | 'researcher' | 'admin';
export type PostStatus = 'draft' | 'published' | 'archived';
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';
export type ProjectMemberRole = 'lead' | 'researcher' | 'contributor' | 'advisor';
export type ProductStatus = 'draft' | 'active' | 'archived';

export interface UserProfile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  methodology: string | null;
  findings: string | null;
  status: ProjectStatus;
  lead_researcher_id: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResearchProjectMember {
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
  joined_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  features: Record<string, any> | null;
  images: string[];
  specifications: Record<string, string>;
  category: string;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
} 