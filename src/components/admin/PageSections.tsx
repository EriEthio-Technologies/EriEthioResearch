'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Plus,
  Grip,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash,
  Settings,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { SectionEditor } from '@/components/admin/SectionEditor';
import { nanoid } from 'nanoid';

interface Section {
  id: string;
  type: string;
  content: Record<string, any>;
  settings: Record<string, any>;
  isVisible?: boolean;
}

interface PageSectionsProps {
  sections: Section[];
  onUpdate: (sections: Section[]) => Promise<void>;
}

const sectionTypes = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'A large header section with title, subtitle, and call-to-action buttons',
    icon: '🎯'
  },
  {
    type: 'text',
    name: 'Text Content',
    description: 'Rich text content with formatting options',
    icon: '📝'
  },
  {
    type: 'grid',
    name: 'Feature Grid',
    description: 'A grid of features or cards with icons and text',
    icon: '📊'
  },
  {
    type: 'image',
    name: 'Image Section',
    description: 'Single image or gallery with captions',
    icon: '🖼️'
  },
  {
    type: 'video',
    name: 'Video Section',
    description: 'Embedded video player with optional description',
    icon: '🎥'
  },
  {
    type: 'cta',
    name: 'Call to Action',
    description: 'Prominent section with buttons and conversion text',
    icon: '🔔'
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Customer testimonials or reviews carousel',
    icon: '💬'
  },
  {
    type: 'pricing',
    name: 'Pricing Table',
    description: 'Compare pricing plans and features',
    icon: '💰'
  },
  {
    type: 'faq',
    name: 'FAQ Section',
    description: 'Frequently asked questions with expandable answers',
    icon: '❓'
  },
  {
    type: 'timeline',
    name: 'Timeline',
    description: 'Chronological display of events or milestones',
    icon: '📅'
  },
  {
    type: 'stats',
    name: 'Statistics',
    description: 'Display key metrics and statistics',
    icon: '📈'
  },
  {
    type: 'team',
    name: 'Team Members',
    description: 'Showcase team members with photos and bios',
    icon: '👥'
  },
  {
    type: 'gallery',
    name: 'Image Gallery',
    description: 'Grid or masonry layout of images',
    icon: '🖼️'
  },
  {
    type: 'form',
    name: 'Contact Form',
    description: 'Custom form builder with various field types',
    icon: '📝'
  },
  {
    type: 'map',
    name: 'Map Section',
    description: 'Interactive map with markers and info windows',
    icon: '🗺️'
  },
  {
    type: 'code',
    name: 'Code Block',
    description: 'Syntax-highlighted code snippets',
    icon: '💻'
  },
  {
    type: 'table',
    name: 'Data Table',
    description: 'Structured data in table format',
    icon: '📊'
  },
  {
    type: 'carousel',
    name: 'Content Carousel',
    description: 'Sliding carousel of content blocks',
    icon: '🎠'
  },
  {
    type: 'tabs',
    name: 'Tabbed Content',
    description: 'Content organized in tabs',
    icon: '📑'
  },
  {
    type: 'accordion',
    name: 'Accordion',
    description: 'Expandable content sections',
    icon: '🔽'
  }
];

export function PageSections({ sections: initialSections, onUpdate }: PageSectionsProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddSection = async (type: string) => {
    const newSection: Section = {
      id: nanoid(),
      type,
      content: {},
      settings: {},
      isVisible: true
    };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    setIsAddingSection(false);

    try {
      setSaving(true);
      await onUpdate(updatedSections);
      toast.success('Section added successfully');
    } catch (error) {
      console.error('Error adding section:', error);
      toast.error('Failed to add section');
      setSections(sections);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSection = async (sectionId: string, updates: Partial<Section>) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );

    setSections(updatedSections);

    try {
      setSaving(true);
      await onUpdate(updatedSections);
      toast.success('Section updated successfully');
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
      setSections(sections);
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateSection = async (section: Section) => {
    const newSection = {
      ...section,
      id: nanoid()
    };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);

    try {
      setSaving(true);
      await onUpdate(updatedSections);
      toast.success('Section duplicated successfully');
    } catch (error) {
      console.error('Error duplicating section:', error);
      toast.error('Failed to duplicate section');
      setSections(sections);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);

    try {
      setSaving(true);
      await onUpdate(updatedSections);
      toast.success('Section deleted successfully');
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
      setSections(sections);
    } finally {
      setSaving(false);
    }
  };

  const handleReorderSections = async (reorderedSections: Section[]) => {
    setSections(reorderedSections);

    try {
      setSaving(true);
      await onUpdate(reorderedSections);
      toast.success('Sections reordered successfully');
    } catch (error) {
      console.error('Error reordering sections:', error);
      toast.error('Failed to reorder sections');
      setSections(sections);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Page Sections</h2>
        <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 gap-4">
                {sectionTypes.map(type => (
                  <Card
                    key={type.type}
                    className="p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleAddSection(type.type)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{type.icon}</div>
                      <div>
                        <h3 className="font-semibold">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Reorder.Group
        axis="y"
        values={sections}
        onReorder={handleReorderSections}
        className="space-y-4"
      >
        {sections.map(section => (
          <Reorder.Item
            key={section.id}
            value={section}
            className="cursor-move"
          >
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Grip className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <h3 className="font-semibold capitalize">
                    {section.type} Section
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateSection(section.id, {
                      isVisible: !section.isVisible
                    })}
                  >
                    {section.isVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSection(section)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateSection(section)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {selectedSection && (
        <Dialog
          open={!!selectedSection}
          onOpenChange={() => setSelectedSection(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
            </DialogHeader>
            <SectionEditor
              section={selectedSection}
              onUpdate={updates => handleUpdateSection(selectedSection.id, updates)}
            />
          </DialogContent>
        </Dialog>
      )}

      {saving && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Saving changes...</span>
          </div>
        </div>
      )}
    </div>
  );
} 