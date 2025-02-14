import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Link2, BookOpen, Calendar, Tag, RefreshCw } from 'lucide-react';
import BulkActionsMenu from './BulkActionsMenu';
import { supabase } from '@/lib/supabase/client';

interface Publication {
  id: string;
  title: string;
  authors: string[];
  published_date: string;
  journal: string;
}

interface PublicationsManagerProps {
  projectId: string;
}

export default function PublicationsManager({ projectId }: PublicationsManagerProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Publication, 'id' | 'created_at'>>({
    title: '',
    abstract: '',
    authors: [],
    publication_date: new Date().toISOString().split('T')[0],
    journal: '',
    doi: '',
    url: '',
    citation_count: 0,
    project_id: projectId,
    tags: [],
  });
  const [error, setError] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedPublications, setSelectedPublications] = useState<string[]>([]);

  useEffect(() => {
    fetchPublications();
  }, [projectId]);

  async function fetchPublications() {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('project_id', projectId)
        .order('publication_date', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddAuthor = () => {
    if (newAuthor && !formData.authors.includes(newAuthor)) {
      setFormData({
        ...formData,
        authors: [...formData.authors, newAuthor]
      });
      setNewAuthor('');
    }
  };

  const handleRemoveAuthor = (authorToRemove: string) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter(author => author !== authorToRemove)
    });
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { error } = await supabase
        .from('publications')
        .insert([formData]);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'publication_added',
        description: `New publication "${formData.title}" was added to project ${projectId}`,
      });

      setShowAddForm(false);
      setFormData({
        title: '',
        abstract: '',
        authors: [],
        publication_date: new Date().toISOString().split('T')[0],
        journal: '',
        doi: '',
        url: '',
        citation_count: 0,
        project_id: projectId,
        tags: [],
      });
      fetchPublications();
    } catch (error) {
      console.error('Error adding publication:', error);
      setError('Failed to add publication');
    }
  };

  const handleBulkAction = async (action: string, data?: any) => {
    try {
      switch (action) {
        case 'delete':
          const { error: deleteError } = await supabase
            .from('publications')
            .delete()
            .in('id', selectedPublications);
          
          if (deleteError) throw deleteError;

          // Log activity
          await supabase.from('admin_activity').insert({
            type: 'publications_bulk_deleted',
            description: `${selectedPublications.length} publications were deleted from project ${projectId}`,
          });
          break;

        case 'update_citations':
          const { error: citationsError } = await supabase
            .from('publications')
            .update({ citation_count: parseInt(data) })
            .in('id', selectedPublications);
          
          if (citationsError) throw citationsError;

          // Log activity
          await supabase.from('admin_activity').insert({
            type: 'publications_citations_updated',
            description: `Citations updated for ${selectedPublications.length} publications in project ${projectId}`,
          });
          break;

        case 'update_tags':
          const { error: tagsError } = await supabase
            .from('publications')
            .update({ tags: data })
            .in('id', selectedPublications);
          
          if (tagsError) throw tagsError;

          // Log activity
          await supabase.from('admin_activity').insert({
            type: 'publications_tags_updated',
            description: `Tags updated for ${selectedPublications.length} publications in project ${projectId}`,
          });
          break;
      }

      // Refresh publications list
      fetchPublications();
      // Clear selection
      setSelectedPublications([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const bulkActions = [
    {
      name: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      requiresConfirmation: true,
    },
    {
      name: 'update_citations',
      label: 'Update Citations',
      icon: RefreshCw,
      requiresInput: true,
      inputType: 'text',
    },
    {
      name: 'update_tags',
      label: 'Update Tags',
      icon: Tag,
      requiresInput: true,
      inputType: 'tags',
    },
  ];

  const togglePublicationSelection = (publicationId: string) => {
    setSelectedPublications(prev =>
      prev.includes(publicationId)
        ? prev.filter(id => id !== publicationId)
        : [...prev, publicationId]
    );
  };

  const toggleAllPublications = () => {
    setSelectedPublications(prev =>
      prev.length === publications.length ? [] : publications.map(p => p.id)
    );
  };

  if (loading) {
    return <div className="text-neon-cyan">Loading publications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-neon-magenta">Project Publications</h2>
        <div className="flex items-center space-x-4">
          <BulkActionsMenu
            selectedItems={selectedPublications}
            onBulkAction={handleBulkAction}
            actions={bulkActions}
          />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Publication</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 space-y-4"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-neon-magenta mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-neon-magenta mb-2">Abstract</label>
            <textarea
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-neon-magenta mb-2">Authors</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="flex-1 px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                placeholder="Enter author name"
              />
              <button
                type="button"
                onClick={handleAddAuthor}
                className="px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
              >
                Add Author
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.authors.map((author, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-3 py-1 bg-neon-cyan/10 text-neon-cyan rounded-full"
                >
                  <span>{author}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAuthor(author)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-neon-magenta mb-2">Tags</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                placeholder="Enter tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-3 py-1 bg-neon-cyan/10 text-neon-cyan rounded-full"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neon-magenta mb-2">Publication Date</label>
              <input
                type="date"
                value={formData.publication_date}
                onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Journal</label>
              <input
                type="text"
                value={formData.journal}
                onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">DOI</label>
              <input
                type="text"
                value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Citation Count</label>
              <input
                type="number"
                value={formData.citation_count}
                onChange={(e) => setFormData({ ...formData, citation_count: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-500/20 text-gray-300 border border-gray-500 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
            >
              Add Publication
            </button>
          </div>
        </motion.form>
      )}

      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neon-cyan/20">
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedPublications.length === publications.length}
                  onChange={toggleAllPublications}
                  className="rounded border-neon-cyan/20 text-neon-magenta focus:ring-neon-magenta"
                />
              </th>
              <th className="px-6 py-3 text-left text-neon-magenta">Title</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Journal</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Date</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Citations</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Tags</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Actions</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((publication) => (
              <tr
                key={publication.id}
                className="border-b border-neon-cyan/10 hover:bg-neon-cyan/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPublications.includes(publication.id)}
                    onChange={() => togglePublicationSelection(publication.id)}
                    className="rounded border-neon-cyan/20 text-neon-magenta focus:ring-neon-magenta"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-300">{publication.title}</div>
                    <div className="text-sm text-gray-500">{publication.authors.join(', ')}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{publication.journal}</td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(publication.publication_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-300">{publication.citation_count}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {publication.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-sm bg-neon-cyan/10 text-neon-cyan rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {publication.url && (
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-neon-cyan transition-colors"
                        title="View publication"
                      >
                        <Link2 className="w-5 h-5" />
                      </a>
                    )}
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this publication?')) {
                          try {
                            const { error } = await supabase
                              .from('publications')
                              .delete()
                              .eq('id', publication.id);

                            if (error) throw error;

                            // Log activity
                            await supabase.from('admin_activity').insert({
                              type: 'publication_deleted',
                              description: `Publication "${publication.title}" was deleted from project ${projectId}`,
                            });

                            fetchPublications();
                          } catch (error) {
                            console.error('Error deleting publication:', error);
                          }
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete publication"
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