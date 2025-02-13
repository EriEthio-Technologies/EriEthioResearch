'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  published_date: string;
  category: string;
  tags: string[];
  slug: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', params.slug)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Blog post not found');
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-neon-cyan mb-4">Error</h1>
            <p className="text-gray-300 mb-6">{error || 'Blog post not found'}</p>
            <Link
              href="/blog"
              className="inline-block px-6 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-block mb-8 text-neon-cyan hover:text-neon-cyan/80 transition-colors"
        >
          ← Back to Blog
        </Link>

        <div className="bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-8">
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <time dateTime={post.published_date}>
                {new Date(post.published_date).toLocaleDateString()}
              </time>
              <span>•</span>
              <span>{post.category}</span>
            </div>

            <h1 className="text-4xl font-bold text-neon-magenta mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-neon-cyan">By {post.author}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-neon-magenta/20 px-3 py-1 rounded-full text-neon-magenta text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </article>
    </div>
  );
} 