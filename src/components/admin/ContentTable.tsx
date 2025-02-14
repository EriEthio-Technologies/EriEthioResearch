'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2, Book, Video, Podcast, ClipboardList, File } from 'lucide-react';
import { DataTable } from './DataTable';
import { useAdminResource } from '@/hooks/useAdminResource';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Content, ContentType } from '@/types/types';
import type { User } from '@/types/types';

interface ContentTableProps {
  type: ContentType;
  onEdit: (content: Content) => void;
}

export function ContentTable({ type, onEdit }: ContentTableProps) {
  const { data: contents, handleDelete } = useAdminResource<Content>(
    supabaseAdmin,
    'content',
    'created_at',
    '*',
    { type: `eq.${type}` }
  );

  const { data: authors } = useAdminResource<User>(
    supabaseAdmin,
    'profiles',
    'created_at',
    'id, full_name'
  );

  const getTypeIcon = (type: ContentType) => {
    switch(type) {
      case 'blog': return <Book className="w-4 h-4" />;
      case 'research': return <ClipboardList className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'podcast': return <Podcast className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const handleDeleteWithType = async (id: string) => {
    try {
      await handleDelete(id, `Deleted ${type}`);
    } catch (error: unknown) {
      console.error('Delete failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <DataTable headers={['Title', 'Status', 'Author', 'Published', 'Actions']}>
      {contents?.map((content: Content) => (
        <motion.tr
          key={content.id}
          className="border-b border-neon-cyan/10 hover:bg-black/20"
        >
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              {getTypeIcon(content.type)}
              <span className="font-medium">{content.title}</span>
            </div>
          </td>
          <td className="px-6 py-4">
            <Badge variant={content.status === 'published' ? 'success' : 'warning'}>
              {content.status}
            </Badge>
          </td>
          <td className="px-6 py-4">
            {authors?.find(a => a.id === content.author_id)?.full_name || 'Unknown'}
          </td>
          <td className="px-6 py-4">
            {content.published_at ? formatDate(content.published_at) : 'Draft'}
          </td>
          <td className="px-6 py-4">
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => onEdit(content)}
                aria-label={`Edit ${content.title}`}
                className="text-neon-cyan hover:text-neon-cyan/80 focus:ring-2 focus:ring-neon-cyan"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDeleteWithType(content.id)} className="text-red-500 hover:text-red-400">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </td>
        </motion.tr>
      ))}
    </DataTable>
  );
}

DataTable.displayName = 'DataTable'; 