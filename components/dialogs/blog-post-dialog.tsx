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

export function BlogPostDialog({
  post,
  open,
  onOpenChange,
  onSuccess,
}: BlogPostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {post ? 'Edit Blog Post' : 'Create Blog Post'}
          </DialogTitle>
          <DialogDescription>
            {post
              ? 'Make changes to your blog post here.'
              : 'Create a new blog post to share with your audience.'}
          </DialogDescription>
        </DialogHeader>
        <BlogPostForm
          post={post}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
} 