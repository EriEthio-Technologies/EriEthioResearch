import { z } from 'zod';
import { StrictResearchProject } from '@/lib/db-types';

const researchSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  status: z.enum(['draft', 'published', 'archived']),
  collaborators: z.array(z.string().email()).optional(),
  timeline: z.object({
    start: z.string().datetime(),
    milestones: z.array(z.object({
      title: z.string().min(3),
      date: z.string().datetime(),
      completed: z.boolean()
    }))
  }).optional()
});

export async function PUT(request: Request, { params }) {
  const validated = researchSchema.safeParse(await request.json());
  if (!validated.success) {
    return NextResponse.json(
      { error: validated.error.flatten() },
      { status: 400 }
    );
  }
  
  // Rest of API logic
} 