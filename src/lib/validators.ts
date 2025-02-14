import { z } from 'zod';

export const ContentSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
  status: z.enum(['draft', 'published']),
  author_id: z.string().uuid(),
  type: z.enum(['blog', 'research', 'video', 'podcast'])
}); 