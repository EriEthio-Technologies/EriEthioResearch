'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import type { BlogPost } from '@/lib/db/types';
import { create, update } from '@/lib/db';
import { useAuth } from '@/hooks/use-auth';
import { Editor } from '@/components/ui/editor';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featured_image: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
});

type PostFormData = z.infer<typeof postSchema>;

interface BlogPostFormProps {
  post?: BlogPost;
  onSuccess?: () => void;
}

export function BlogPostForm({ post, onSuccess }: BlogPostFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(post?.content || '');

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: post ? {
      ...post,
    } : {
      status: 'draft',
    },
  });

  async function onSubmit(data: PostFormData) {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const submitData = {
        ...data,
        content,
        author_id: user.id,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
      };

      if (post) {
        await update('blog_posts', post.id, submitData);
      } else {
        await create('blog_posts', submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving blog post:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFeaturedImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      form.setValue('featured_image', urls[0]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Content</FormLabel>
          <Editor
            value={content}
            onChange={setContent}
            placeholder="Write your blog post content here..."
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Featured Image</FormLabel>
          <FileUpload
            bucket="blog-images"
            path={`posts/${post?.id || 'new'}`}
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            }}
            multiple={false}
            onUploadComplete={handleFeaturedImageUpload}
          />
          {form.watch('featured_image') && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <img
                src={form.watch('featured_image')}
                alt="Featured"
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => form.setValue('featured_image', '')}
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </Button>
      </form>
    </Form>
  );
} 