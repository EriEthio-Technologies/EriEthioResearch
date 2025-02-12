'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  Save, 
  X, 
  Plus, 
  Layout, 
  Type, 
  Image as ImageIcon,
  Video, 
  FileText,
  Grid,
  Columns,
  Move,
  Settings,
  Trash2,
  ChevronUp,
  ChevronDown,
  Code,
  Table,
  Rows,
  Palette,
  Globe,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { iconMap } from '@/lib/icons';
import { SectionEditor } from '@/components/admin/SectionEditor';
import { ThemePicker } from '@/components/ui/theme-picker';
import { useTheme } from '@/hooks/useTheme';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageSection {
  id: string;
  type: string;
  content: any;
  settings: {
    background?: string;
    padding?: string;
    fullWidth?: boolean;
    alignment?: 'left' | 'center' | 'right';
    textColor?: string;
    [key: string]: any;
  };
}

interface PageData {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  sections: PageSection[];
  meta: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
  };
  settings: {
    requiresAuth?: boolean;
    layout?: 'default' | 'full' | 'sidebar';
    theme?: 'light' | 'dark';
    customCss?: string;
    scripts?: string[];
  };
  theme: Theme;
}

interface PageBuilderProps {
  initialData?: PageData;
  selectedSection?: string | null;
  onSectionSelect?: (sectionId: string | null) => void;
  onSave?: (data: PageData) => void;
  onCancel?: () => void;
  saving?: boolean;
}

const sectionTypes = [
  { type: 'hero', icon: Layout, label: 'Hero Section' },
  { type: 'text', icon: Type, label: 'Text Content' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'grid', icon: Grid, label: 'Feature Grid' },
  { type: 'columns', icon: Columns, label: 'Columns' },
  { type: 'markdown', icon: FileText, label: 'Markdown' },
  { type: 'code', icon: Code, label: 'Code Block' },
  { type: 'table', icon: Table, label: 'Table' },
  { type: 'timeline', icon: Rows, label: 'Timeline' }
];

export default function PageBuilder({
  initialData,
  selectedSection,
  onSectionSelect,
  onSave,
  onCancel,
  saving = false
}: PageBuilderProps) {
  const [pageData, setPageData] = useState<PageData>(initialData || {
    title: '',
    slug: '',
    sections: [],
    meta: {},
    settings: {},
    theme: presetThemes[0],
  });
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (selectedSection) {
      const section = pageData.sections.find(s => s.id === selectedSection);
      if (section) {
        setEditingSection(section);
      }
    }
  }, [selectedSection, pageData.sections]);

  useTheme(pageData.theme);

  const handleAddSection = (type: string) => {
    const newSection: PageSection = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContent(type),
      settings: getDefaultSettings(type)
    };

    setPageData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setShowSectionPicker(false);
    onSectionSelect?.(newSection.id);
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<PageSection>) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, ...updates }
          : section
      )
    }));
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) {
      return;
    }

    setPageData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    onSectionSelect?.(null);
  };

  const handleReorderSections = (reorderedSections: PageSection[]) => {
    setPageData(prev => ({
      ...prev,
      sections: reorderedSections
    }));
  };

  const handleSave = async () => {
    if (!pageData.title || !pageData.slug) {
      setError('Title and slug are required');
      return;
    }

    setError('');

    try {
      const { data, error: saveError } = await supabase
        .from('pages')
        .upsert({
          id: pageData.id,
          title: pageData.title,
          slug: pageData.slug,
          description: pageData.description,
          sections: pageData.sections,
          meta: pageData.meta,
          settings: pageData.settings,
          updated_at: new Date().toISOString()
        });

      if (saveError) throw saveError;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: pageData.id ? 'page_updated' : 'page_created',
        description: `Page "${pageData.title}" was ${pageData.id ? 'updated' : 'created'}`,
      });

      onSave?.(pageData);
      router.push('/admin/pages');
    } catch (error) {
      console.error('Error saving page:', error);
      setError('Failed to save page');
    }
  };

  const handleUpdateMeta = (updates: Partial<PageData['meta']>) => {
    setPageData(prev => ({
      ...prev,
      meta: { ...prev.meta, ...updates }
    }));
  };

  const handleUpdateSettings = (updates: Partial<PageData['settings']>) => {
    setPageData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-neon-cyan/20">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 -mb-px text-lg font-medium transition-colors ${
              activeTab === 'content'
                ? 'text-neon-cyan border-b-2 border-neon-cyan'
                : 'text-gray-400 hover:text-neon-cyan'
            }`}
          >
            <Layout className="w-5 h-5 inline-block mr-2" />
            Content
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 -mb-px text-lg font-medium transition-colors ${
              activeTab === 'seo'
                ? 'text-neon-cyan border-b-2 border-neon-cyan'
                : 'text-gray-400 hover:text-neon-cyan'
            }`}
          >
            <Search className="w-5 h-5 inline-block mr-2" />
            SEO
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 -mb-px text-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-neon-cyan border-b-2 border-neon-cyan'
                : 'text-gray-400 hover:text-neon-cyan'
            }`}
          >
            <Settings className="w-5 h-5 inline-block mr-2" />
            Settings
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <Reorder.Group
              axis="y"
              values={pageData.sections}
              onReorder={handleReorderSections}
              className="space-y-4"
            >
              {pageData.sections.map((section) => (
                <Reorder.Item
                  key={section.id}
                  value={section}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedSection === section.id
                      ? 'bg-neon-cyan/10 border-neon-cyan'
                      : 'bg-black/30 border-neon-cyan/20 hover:border-neon-cyan/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-neon-cyan/20">
                        {sectionTypes.find(t => t.type === section.type)?.icon && (
                          <section.icon className="w-5 h-5 text-neon-cyan" />
                        )}
                      </div>
                      <span className="text-lg font-medium text-neon-cyan">
                        {sectionTypes.find(t => t.type === section.type)?.label || section.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSectionSelect?.(section.id)}
                        className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="flex flex-col">
                        <button
                          onClick={() => {
                            const index = pageData.sections.findIndex(s => s.id === section.id);
                            if (index > 0) {
                              const newSections = [...pageData.sections];
                              [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
                              handleReorderSections(newSections);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-neon-cyan transition-colors"
                          disabled={pageData.sections[0].id === section.id}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const index = pageData.sections.findIndex(s => s.id === section.id);
                            if (index < pageData.sections.length - 1) {
                              const newSections = [...pageData.sections];
                              [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                              handleReorderSections(newSections);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-neon-cyan transition-colors"
                          disabled={pageData.sections[pageData.sections.length - 1].id === section.id}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <button
              onClick={() => setShowSectionPicker(true)}
              className="w-full py-4 border-2 border-dashed border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/10 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Section</span>
            </button>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6 bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20">
            <div>
              <label className="block text-neon-magenta mb-2">Meta Title</label>
              <input
                type="text"
                value={pageData.meta.title || ''}
                onChange={(e) => handleUpdateMeta({ title: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                placeholder="Page Title - Site Name"
              />
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Meta Description</label>
              <textarea
                value={pageData.meta.description || ''}
                onChange={(e) => handleUpdateMeta({ description: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                rows={3}
                placeholder="Brief description of the page content..."
              />
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Keywords</label>
              <input
                type="text"
                value={pageData.meta.keywords?.join(', ') || ''}
                onChange={(e) => handleUpdateMeta({ 
                  keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">OG Image URL</label>
              <input
                type="text"
                value={pageData.meta.ogImage || ''}
                onChange={(e) => handleUpdateMeta({ ogImage: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="noIndex"
                checked={pageData.meta.noIndex || false}
                onChange={(e) => handleUpdateMeta({ noIndex: e.target.checked })}
                className="rounded border-neon-cyan/20 bg-black/30 text-neon-cyan focus:ring-neon-cyan"
              />
              <label htmlFor="noIndex" className="text-gray-300">
                Exclude from search engines (noindex)
              </label>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20">
            <div>
              <label className="block text-neon-magenta mb-2">Layout</label>
              <select
                value={pageData.settings.layout || 'default'}
                onChange={(e) => handleUpdateSettings({ layout: e.target.value as any })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              >
                <option value="default">Default</option>
                <option value="full">Full Width</option>
                <option value="sidebar">With Sidebar</option>
              </select>
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Theme</label>
              <select
                value={pageData.settings.theme || 'dark'}
                onChange={(e) => handleUpdateSettings({ theme: e.target.value as any })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Custom CSS</label>
              <textarea
                value={pageData.settings.customCss || ''}
                onChange={(e) => handleUpdateSettings({ customCss: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none font-mono"
                rows={5}
                placeholder="/* Add custom CSS here */"
              />
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Custom Scripts</label>
              <textarea
                value={pageData.settings.scripts?.join('\n') || ''}
                onChange={(e) => handleUpdateSettings({ 
                  scripts: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none font-mono"
                rows={5}
                placeholder="// Add script URLs (one per line)"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Theme</Label>
                <ThemePicker
                  value={pageData.theme}
                  onChange={(theme) => setPageData({ ...pageData, theme })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section Editor Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 space-y-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>

          {editingSection && (
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 space-y-4">
              <h3 className="text-lg font-semibold text-neon-cyan">
                Edit Section
              </h3>
              {/* Section-specific editor will be rendered here */}
              {renderSectionEditor(editingSection, handleUpdateSection)}
            </div>
          )}
        </div>
      </div>

      {/* Section Picker Modal */}
      {showSectionPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 p-8 rounded-lg border border-neon-cyan/20 max-w-lg w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-neon-cyan mb-6">Add Section</h2>
            <div className="grid grid-cols-2 gap-4">
              {sectionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.type}
                    onClick={() => handleAddSection(type.type)}
                    className="flex flex-col items-center p-4 bg-black/30 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                  >
                    <Icon className="w-8 h-8 text-neon-cyan mb-2" />
                    <span className="text-gray-300">{type.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowSectionPicker(false)}
              className="mt-6 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function getDefaultContent(type: string) {
  switch (type) {
    case 'hero':
      return {
        title: 'New Hero Section',
        subtitle: 'Add your subtitle here',
        buttons: [
          { text: 'Primary Button', href: '#', variant: 'primary' },
          { text: 'Secondary Button', href: '#', variant: 'secondary' }
        ]
      };
    case 'text':
      return {
        text: '<p>Add your text content here...</p>'
      };
    case 'grid':
      return {
        title: 'Feature Grid',
        items: [
          {
            icon: 'Star',
            title: 'Feature 1',
            description: 'Description for feature 1'
          }
        ]
      };
    // Add more default content for other section types
    default:
      return {};
  }
}

function getDefaultSettings(type: string) {
  const common = {
    background: 'none',
    padding: 'lg',
    fullWidth: false,
    alignment: 'left'
  };

  switch (type) {
    case 'hero':
      return {
        ...common,
        alignment: 'center',
        fullWidth: true,
        background: 'gradient'
      };
    case 'grid':
      return {
        ...common,
        columns: 3,
        gap: 'lg'
      };
    default:
      return common;
  }
}

function renderSectionEditor(section: PageSection, onUpdate: (id: string, updates: Partial<PageSection>) => void) {
  return <SectionEditor section={section} onUpdate={onUpdate} />;
} 