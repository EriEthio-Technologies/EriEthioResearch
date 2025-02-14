'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ContentTable } from './ContentTable';
import { ContentEditor } from './ContentEditor';
import type { ContentType, Content } from '@/types/content';
import { useAdminResource } from '@/hooks/useAdminResource';
import { Button } from '@/components/ui/button';

export default function ContentManager() {
  const { data: contentList, fetchData } = useAdminResource<Content>(
    supabaseAdmin,
    'content'
  );

  const [selectedType, setSelectedType] = useState<ContentType>('blog');
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      
      <Tabs value={selectedType} onValueChange={v => setSelectedType(v as ContentType)}>
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