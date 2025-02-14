'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ContentTable } from './ContentTable';
import { ContentEditor } from './ContentEditor';
import type { ContentType, Content } from '@/types/content';
import { useAdminResource } from '@/hooks/useAdminResource';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'post' | 'document';
  status: 'draft' | 'published' | 'archived';
  updated_at: string;
}

const ContentManager = () => {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [selectedType, setSelectedType] = useState<ContentItem['type']>('page');
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  const fetchContent = useCallback(async (type: ContentItem['type']) => {
    const { data } = await supabase
      .from('content')
      .select('*')
      .eq('type', type);
    setContentList(data || []);
  }, []);

  useEffect(() => {
    fetchContent(selectedType);
  }, [selectedType, fetchContent]);

  const handleCreateContent = () => {
    setEditingContent({
      id: 'new',
      type: selectedType,
      title: '',
      slug: '',
      content: '',
      status: 'draft',
      author_id: session.user.id,
      created_at: new Date().toISOString()
    } as Content);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreateContent}>
          Create New Content
        </Button>
      </div>
      
      <Tabs value={selectedType} onValueChange={v => setSelectedType(v as ContentItem['type'])}>
        <TabsList className="grid grid-cols-5 w-full bg-gray-900">
          <TabsTrigger value="page">Pages</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="podcast">Podcasts</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType}>
          {editingContent ? (
            <ContentEditor 
              content={editingContent}
              onSave={(updated) => {
                // Handle save logic
                setEditingContent(null);
              }}
              onCancel={() => setEditingContent(null)}
            />
          ) : (
            <ContentTable 
              type={selectedType}
              onEdit={(content) => setEditingContent(content)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ContentManager;