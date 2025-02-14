// Add comprehensive TypeScript types
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface WebVitalsMetric {
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB';
  value: number;
  id: string;
  label?: string;
  page_url: string;
  user_agent: string;
}

export type StrictResearchProject = ResearchProject & {
  collaborators: string[];
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  timeline: {
    start: string;
    milestones: Array<{
      title: string;
      date: string;
      completed: boolean;
    }>;
  };
}; 