export type ContentType = 'page' | 'blog' | 'research' | 'video' | 'podcast';

export interface ContentBase {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  featured_image?: string;
  tags?: string[];
  published_at?: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
}

export interface BlogPost extends ContentBase {
  type: 'blog';
  read_time: number;
  category: string;
}

export interface ResearchPublication extends ContentBase {
  type: 'research';
  doi?: string;
  journal?: string;
  collaborators?: string[];
}

export interface MediaContent extends ContentBase {
  type: 'video' | 'podcast';
  duration: number;
  embed_url: string;
  transcript?: string;
}

export type Content = BlogPost | ResearchPublication | MediaContent; 