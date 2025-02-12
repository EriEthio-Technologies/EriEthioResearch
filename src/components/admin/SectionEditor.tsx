'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { Editor } from '@/components/ui/editor';
import { IconPicker } from '@/components/ui/icon-picker';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

interface Section {
  id: string;
  type: string;
  content: Record<string, any>;
  settings: Record<string, any>;
  isVisible?: boolean;
}

interface SectionEditorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => Promise<void>;
}

export function SectionEditor({ section, onUpdate }: SectionEditorProps) {
  const [content, setContent] = useState(section.content);
  const [settings, setSettings] = useState(section.settings);
  const [saving, setSaving] = useState(false);

  const handleContentChange = (field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate({
        content,
        settings
      });
      toast.success('Section updated successfully');
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const renderContentFields = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={content.title || ''}
                onChange={e => handleContentChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={content.subtitle || ''}
                onChange={e => handleContentChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>

            <div className="space-y-2">
              <Label>Buttons</Label>
              {(content.buttons || []).map((button: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={button.text || ''}
                    onChange={e => {
                      const newButtons = [...(content.buttons || [])];
                      newButtons[index] = {
                        ...button,
                        text: e.target.value
                      };
                      handleContentChange('buttons', newButtons);
                    }}
                    placeholder="Button text"
                  />
                  <Input
                    value={button.href || ''}
                    onChange={e => {
                      const newButtons = [...(content.buttons || [])];
                      newButtons[index] = {
                        ...button,
                        href: e.target.value
                      };
                      handleContentChange('buttons', newButtons);
                    }}
                    placeholder="Button link"
                  />
                  <Select
                    value={button.variant || 'default'}
                    onValueChange={value => {
                      const newButtons = [...(content.buttons || [])];
                      newButtons[index] = {
                        ...button,
                        variant: value
                      };
                      handleContentChange('buttons', newButtons);
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newButtons = [...(content.buttons || [])];
                      newButtons.splice(index, 1);
                      handleContentChange('buttons', newButtons);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newButtons = [...(content.buttons || []), {
                    text: '',
                    href: '',
                    variant: 'default'
                  }];
                  handleContentChange('buttons', newButtons);
                }}
              >
                Add Button
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Background Image</Label>
              <ImageUpload
                value={content.backgroundImage}
                onChange={value => handleContentChange('backgroundImage', value)}
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Content</Label>
              <Editor
                value={content.text || ''}
                onChange={value => handleContentChange('text', value)}
              />
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={content.title || ''}
                onChange={e => handleContentChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="space-y-2">
              <Label>Items</Label>
              {(content.items || []).map((item: any, index: number) => (
                <div key={index} className="space-y-2 border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Item {index + 1}</Label>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const newItems = [...(content.items || [])];
                        newItems.splice(index, 1);
                        handleContentChange('items', newItems);
                      }}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <IconPicker
                      value={item.icon}
                      onChange={value => {
                        const newItems = [...(content.items || [])];
                        newItems[index] = {
                          ...item,
                          icon: value
                        };
                        handleContentChange('items', newItems);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={item.title || ''}
                      onChange={e => {
                        const newItems = [...(content.items || [])];
                        newItems[index] = {
                          ...item,
                          title: e.target.value
                        };
                        handleContentChange('items', newItems);
                      }}
                      placeholder="Item title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Editor
                      value={item.description || ''}
                      onChange={value => {
                        const newItems = [...(content.items || [])];
                        newItems[index] = {
                          ...item,
                          description: value
                        };
                        handleContentChange('items', newItems);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newItems = [...(content.items || []), {
                    icon: '',
                    title: '',
                    description: ''
                  }];
                  handleContentChange('items', newItems);
                }}
              >
                Add Item
              </Button>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload
                value={content.image}
                onChange={value => handleContentChange('image', value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={content.caption || ''}
                onChange={e => handleContentChange('caption', e.target.value)}
                placeholder="Enter image caption"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={content.alt || ''}
                onChange={e => handleContentChange('alt', e.target.value)}
                placeholder="Enter alt text"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Video URL</Label>
              <Input
                id="url"
                value={content.url || ''}
                onChange={e => handleContentChange('url', e.target.value)}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={content.title || ''}
                onChange={e => handleContentChange('title', e.target.value)}
                placeholder="Enter video title"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Editor
                value={content.description || ''}
                onChange={value => handleContentChange('description', value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSettingsFields = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Background Color</Label>
          <ColorPicker
            value={settings.backgroundColor || '#ffffff'}
            onChange={value => handleSettingsChange('backgroundColor', value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Text Color</Label>
          <ColorPicker
            value={settings.textColor || '#000000'}
            onChange={value => handleSettingsChange('textColor', value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Padding</Label>
          <Select
            value={settings.padding || 'md'}
            onValueChange={value => handleSettingsChange('padding', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Width</Label>
          <Select
            value={settings.width || 'container'}
            onValueChange={value => handleSettingsChange('width', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="container">Container</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="narrow">Narrow</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Animation</Label>
          <Select
            value={settings.animation || 'none'}
            onValueChange={value => handleSettingsChange('animation', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="fade">Fade</SelectItem>
              <SelectItem value="slide">Slide</SelectItem>
              <SelectItem value="zoom">Zoom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="visible">Visible</Label>
          <Switch
            id="visible"
            checked={settings.visible !== false}
            onCheckedChange={value => handleSettingsChange('visible', value)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {renderContentFields()}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {renderSettingsFields()}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
} 