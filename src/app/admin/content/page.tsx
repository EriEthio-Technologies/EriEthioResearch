'use client';

import { useState } from 'react';
import ContentManager from '@/components/admin/ContentManager';
import ContentEditor from '@/components/admin/ContentEditor';

export default function ContentManagementPage() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [contentType, setContentType] = useState<'blog' | 'research' | 'case-study'>('blog');

  const handleSave = () => {
    setShowEditor(false);
    setEditingContent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-8">
      {showEditor ? (
        <ContentEditor
          id={editingContent?.id}
          type={contentType}
          initialData={editingContent}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingContent(null);
          }}
        />
      ) : (
        <ContentManager
          onEdit={(content) => {
            setEditingContent(content);
            setContentType(content.type);
            setShowEditor(true);
          }}
          onNew={(type) => {
            setContentType(type);
            setShowEditor(true);
          }}
        />
      )}
    </div>
  );
} 