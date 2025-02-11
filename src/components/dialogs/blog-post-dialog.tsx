'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BlogPostForm } from '@/components/forms/blog-post-form';
import type { BlogPost } from '@/lib/db/types';

interface BlogPostDialogProps {
  post?: BlogPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Temporarily commented out for deployment
export function BlogPostDialog() {
  return null;
} 