'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/db';
import type { BlogPost, UserProfile } from '@/lib/db/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPostDialog } from '@/components/dialogs/blog-post-dialog';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PostWithAuthor extends BlogPost {
  user_profiles: UserProfile;
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            user_profiles (*)
          `)
          .eq('slug', params.slug)
          .single();

        if (error) throw error;
        setPost(data as PostWithAuthor);
      } catch (error) {
        console.error('Error loading blog post:', error);
        router.push('/blog');
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [params.slug, router]);

  async function handleDelete() {
    if (!post) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      router.push('/blog');
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  }

  if (isLoading) {
    return <div>Loading post...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {post.featured_image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={post.featured_image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div>
                By {post.user_profiles.full_name}
              </div>
              <div>•</div>
              <div>
                Status: {post.status}
              </div>
              {post.published_at && (
                <>
                  <div>•</div>
                  <div>
                    Published: {format(new Date(post.published_at), 'PPP')}
                  </div>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {post.excerpt && (
              <div className="text-lg font-medium text-muted-foreground">
                {post.excerpt}
              </div>
            )}
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <BlogPostDialog
        post={post}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 