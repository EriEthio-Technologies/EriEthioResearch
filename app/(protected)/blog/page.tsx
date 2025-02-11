'use client';

import { useEffect, useState } from 'react';
import { getBlogPosts } from '@/lib/db';
import type { BlogPost } from '@/lib/db/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BlogPostDialog } from '@/components/dialogs/blog-post-dialog';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const { posts } = await getBlogPosts();
        setPosts(posts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.content.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="flex items-center gap-4">
          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Posts</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)}>New Post</Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => router.push(`/blog/${post.slug}`)}
          >
            {post.featured_image && (
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                {post.status}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...'}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {post.published_at && (
                    <span>
                      Published: {format(new Date(post.published_at), 'PPP')}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No blog posts found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {status
              ? `No posts with status "${status}"`
              : search
              ? 'No posts match your search'
              : 'Start by creating a new blog post'}
          </p>
        </div>
      )}

      <BlogPostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
} 