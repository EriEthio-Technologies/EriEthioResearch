'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VisualEditor } from './VisualEditor';
import { MediaUploader } from './MediaUploader';
import { SEOAnalyzer } from './SEOAnalyzer';
import type { Content } from '@/types/content';
import { useSession } from 'next-auth/react';
import DOMPurify from 'dompurify';

const sanitizeContent = (dirty: string) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href']
  });
};

export function ContentEditor({
  content,
  onSave,
  onCancel
}: {
  content: Content;
  onSave: (data: Content) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, watch, setValue } = useForm<Content>({
    defaultValues: content
  });

  const { data: session } = useSession();
  if (session?.user.role !== 'admin') {
    return <div>Unauthorized access</div>;
  }

  const onSubmit = (data: Content) => {
    const sanitized = {
      ...data,
      content: sanitizeContent(data.content),
      title: sanitizeContent(data.title)
    };
    onSave(sanitized);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input {...register('title')} className="bg-gray-900 border-neon-cyan/20" />
          </div>

          <div>
            <Label>Slug</Label>
            <Input {...register('slug')} className="bg-gray-900 border-neon-cyan/20" />
          </div>

          <div>
            <Label>Content</Label>
            <VisualEditor
              initialSections={JSON.parse(content.content || '[]')}
              onUpdate={(sections) => setValue('content', JSON.stringify(sections))}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="neon">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <SEOAnalyzer content={watch()} />
        <MediaUploader
          label="Featured Image"
          onUpload={(url) => setValue('featured_image', url)}
          initialValue={content.featured_image}
        />
      </div>
    </div>
  );
}