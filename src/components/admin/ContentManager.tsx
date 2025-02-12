import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Plus, Search, Filter, Tag, Edit, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'research' | 'case-study';
  status: 'draft' | 'published' | 'archived';
  author: {
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  tags: string[];
}

export default function ContentManager() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      // Fetch blog posts
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          status,
          created_at,
          updated_at,
          tags,
          author:profiles(full_name, email)
        `);

      // Fetch research articles
      const { data: research, error: researchError } = await supabase
        .from('research_projects')
        .select(`
          id,
          title,
          status,
          created_at,
          updated_at,
          tags,
          author:profiles(full_name, email)
        `);

      // Fetch case studies
      const { data: caseStudies, error: caseStudyError } = await supabase
        .from('case_studies')
        .select(`
          id,
          title,
          status,
          created_at,
          updated_at,
          tags,
          author:profiles(full_name, email)
        `);

      if (blogError || researchError || caseStudyError) throw new Error('Error fetching content');

      // Combine and format content
      const formattedContent: ContentItem[] = [
        ...(blogPosts?.map(post => ({ ...post, type: 'blog' as const })) || []),
        ...(research?.map(item => ({ ...item, type: 'research' as const })) || []),
        ...(caseStudies?.map(study => ({ ...study, type: 'case-study' as const })) || [])
      ];

      // Extract unique tags
      const tags = new Set<string>();
      formattedContent.forEach(item => {
        item.tags?.forEach(tag => tags.add(tag));
      });

      setContent(formattedContent);
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !selectedType || item.type === selectedType;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => item.tags?.includes(tag));

    return matchesSearch && matchesType && matchesStatus && matchesTags;
  });

  const handleDelete = async (item: ContentItem) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      const table = item.type === 'blog' ? 'blog_posts' :
                    item.type === 'research' ? 'research_projects' :
                    'case_studies';

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'content_deleted',
        description: `${item.type} "${item.title}" was deleted`,
      });

      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  if (loading) {
    return <div className="text-neon-cyan">Loading content...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neon-cyan">Content Management</h1>
        <button
          onClick={() => router.push('/admin/content/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Content</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="blog">Blog Posts</option>
          <option value="research">Research Articles</option>
          <option value="case-study">Case Studies</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              )}
              className={`px-3 py-1 rounded-full flex items-center gap-1 border transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta'
                  : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 hover:bg-neon-cyan/20'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content List */}
      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neon-cyan/20">
              <th className="px-6 py-3 text-left text-neon-magenta">Title</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Type</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Status</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Author</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Last Updated</th>
              <th className="px-6 py-3 text-right text-neon-magenta">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContent.map((item) => (
              <tr
                key={`${item.type}-${item.id}`}
                className="border-b border-neon-cyan/10 hover:bg-black/20"
              >
                <td className="px-6 py-4 text-gray-300">{item.title}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-sm rounded-full bg-neon-cyan/10 text-neon-cyan">
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    item.status === 'published' ? 'bg-green-100 text-green-800' :
                    item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">{item.author.name}</td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(item.updated_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => router.push(`/${item.type}s/${item.id}`)}
                      className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/content/${item.id}/edit`)}
                      className="p-2 text-gray-400 hover:text-neon-magenta transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}