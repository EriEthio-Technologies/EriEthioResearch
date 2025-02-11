'use client';

import { useState } from 'react';
import ContentManager from '@/components/admin/ContentManager';
import ContentEditor from '@/components/admin/ContentEditor';

export default function ContentManagementPage() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [contentType, setContentType] = useState<'blog' | 'research' | 'case-study'>('blog');

  const handleSave = async (data: any) => {
    // Handle saving content
    setShowEditor(false);
    setEditingContent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <ContentManager />
      
      {showEditor && (
        <ContentEditor
          type={contentType}
          initialData={editingContent}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingContent(null);
          }}
        />
      )}
    </div>
  );
} 