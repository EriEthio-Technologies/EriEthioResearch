import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Save, X, Upload, Tag as TagIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from './MarkdownEditor';
import ImageGallery from './ImageGallery';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContentEditorProps {
  id?: string;
  type?: 'blog' | 'research' | 'case-study';
  initialData?: any;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function ContentEditor({
  id,
  type = 'blog',
  initialData,
  onSave,
  onCancel
}: ContentEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialData?.featured_image || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setStatus(initialData.status || 'draft');
      setTags(initialData.tags || []);
      setFeaturedImageUrl(initialData.featured_image || '');
    }
  }, [initialData]);

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `content/${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('content-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setFeaturedImage(file);
      const imageUrl = await handleImageUpload(file);
      setFeaturedImageUrl(imageUrl);
    } catch (error) {
      console.error('Error handling featured image:', error);
      setError('Failed to upload featured image');
    }
  };

  const handleTagAdd = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const table = type === 'blog' ? 'blog_posts' :
                    type === 'research' ? 'research_projects' :
                    'case_studies';

      const contentData = {
        title,
        content,
        status,
        tags,
        featured_image: featuredImageUrl,
        updated_at: new Date().toISOString()
      };

      if (id) {
        // Update existing content
        const { error: updateError } = await supabase
          .from(table)
          .update(contentData)
          .eq('id', id);

        if (updateError) throw updateError;
      } else {
        // Create new content
        const { error: insertError } = await supabase
          .from(table)
          .insert({
            ...contentData,
            created_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      // Log activity
      await supabase.from('admin_activity').insert({
        type: id ? 'content_updated' : 'content_created',
        description: `${type} "${title}" was ${id ? 'updated' : 'created'}`,
      });

      onSave?.();
      router.push('/admin/content');
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neon-cyan">
          {id ? 'Edit Content' : 'New Content'}
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Featured Image
          </label>
          <div className="flex items-center space-x-4">
            {featuredImageUrl && (
              <img
                src={featuredImageUrl}
                alt="Featured"
                className="w-32 h-32 object-cover rounded-lg border border-neon-cyan/20"
              />
            )}
            <label className="flex items-center justify-center px-4 py-2 border border-neon-cyan/20 rounded-lg cursor-pointer hover:bg-black/30 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 flex items-center space-x-2"
              >
                <TagIcon className="w-4 h-4" />
                <span>{tag}</span>
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            />
            <button
              onClick={handleTagAdd}
              className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Content
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            onImageUpload={handleImageUpload}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}