'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

interface CustomizationSettings {
  layout: {
    type: string;
    width: string;
    padding: string;
    gap: string;
    columns: number;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: number;
    scaleRatio: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  effects: {
    animations: boolean;
    parallax: boolean;
    fadeIn: boolean;
    smoothScroll: boolean;
  };
  advanced: {
    customCSS: string;
    customJS: string;
    metaTags: string;
    customClasses: string;
  };
}

interface PageCustomizationProps {
  initialSettings?: CustomizationSettings;
  onUpdate: (settings: CustomizationSettings) => Promise<void>;
}

const defaultSettings: CustomizationSettings = {
  layout: {
    type: 'default',
    width: 'container',
    padding: 'md',
    gap: 'md',
    columns: 12
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: 16,
    scaleRatio: 1.25
  },
  colors: {
    primary: '#2563eb',
    secondary: '#16a34a',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937'
  },
  effects: {
    animations: true,
    parallax: false,
    fadeIn: true,
    smoothScroll: true
  },
  advanced: {
    customCSS: '',
    customJS: '',
    metaTags: '',
    customClasses: ''
  }
};

export function PageCustomization({ initialSettings, onUpdate }: PageCustomizationProps) {
  const [settings, setSettings] = useState<CustomizationSettings>(
    initialSettings || defaultSettings
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (
    category: keyof CustomizationSettings,
    field: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(settings);
      toast.success('Customization settings saved successfully');
    } catch (error) {
      console.error('Error saving customization settings:', error);
      toast.error('Failed to save customization settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Page Customization</h2>
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

      <Tabs defaultValue="layout">
        <TabsList>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="layout-type">Layout Type</Label>
              <Select
                value={settings.layout.type}
                onValueChange={value => handleChange('layout', 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="landing">Landing</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout-width">Content Width</Label>
              <Select
                value={settings.layout.width}
                onValueChange={value => handleChange('layout', 'width', value)}
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
              <Label htmlFor="layout-padding">Padding</Label>
              <Select
                value={settings.layout.padding}
                onValueChange={value => handleChange('layout', 'padding', value)}
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
              <Label htmlFor="layout-gap">Gap</Label>
              <Select
                value={settings.layout.gap}
                onValueChange={value => handleChange('layout', 'gap', value)}
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
              <Label htmlFor="layout-columns">Grid Columns</Label>
              <Slider
                value={[settings.layout.columns]}
                onValueChange={([value]) => handleChange('layout', 'columns', value)}
                min={1}
                max={12}
                step={1}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="typography-heading">Heading Font</Label>
              <Select
                value={settings.typography.headingFont}
                onValueChange={value => handleChange('typography', 'headingFont', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="typography-body">Body Font</Label>
              <Select
                value={settings.typography.bodyFont}
                onValueChange={value => handleChange('typography', 'bodyFont', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="typography-size">Base Font Size (px)</Label>
              <Slider
                value={[settings.typography.baseSize]}
                onValueChange={([value]) => handleChange('typography', 'baseSize', value)}
                min={12}
                max={24}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typography-scale">Scale Ratio</Label>
              <Slider
                value={[settings.typography.scaleRatio]}
                onValueChange={([value]) => handleChange('typography', 'scaleRatio', value)}
                min={1}
                max={2}
                step={0.05}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="colors-primary">Primary Color</Label>
              <ColorPicker
                value={settings.colors.primary}
                onChange={value => handleChange('colors', 'primary', value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors-secondary">Secondary Color</Label>
              <ColorPicker
                value={settings.colors.secondary}
                onChange={value => handleChange('colors', 'secondary', value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors-accent">Accent Color</Label>
              <ColorPicker
                value={settings.colors.accent}
                onChange={value => handleChange('colors', 'accent', value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors-background">Background Color</Label>
              <ColorPicker
                value={settings.colors.background}
                onChange={value => handleChange('colors', 'background', value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors-text">Text Color</Label>
              <ColorPicker
                value={settings.colors.text}
                onChange={value => handleChange('colors', 'text', value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="effects-animations">Enable Animations</Label>
              <Switch
                checked={settings.effects.animations}
                onCheckedChange={value => handleChange('effects', 'animations', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="effects-parallax">Enable Parallax</Label>
              <Switch
                checked={settings.effects.parallax}
                onCheckedChange={value => handleChange('effects', 'parallax', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="effects-fadeIn">Enable Fade In</Label>
              <Switch
                checked={settings.effects.fadeIn}
                onCheckedChange={value => handleChange('effects', 'fadeIn', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="effects-smoothScroll">Smooth Scrolling</Label>
              <Switch
                checked={settings.effects.smoothScroll}
                onCheckedChange={value => handleChange('effects', 'smoothScroll', value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="advanced-css">Custom CSS</Label>
              <textarea
                id="advanced-css"
                className="w-full h-32 p-2 border rounded font-mono"
                value={settings.advanced.customCSS}
                onChange={e => handleChange('advanced', 'customCSS', e.target.value)}
                placeholder="Add custom CSS styles..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanced-js">Custom JavaScript</Label>
              <textarea
                id="advanced-js"
                className="w-full h-32 p-2 border rounded font-mono"
                value={settings.advanced.customJS}
                onChange={e => handleChange('advanced', 'customJS', e.target.value)}
                placeholder="Add custom JavaScript code..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanced-meta">Custom Meta Tags</Label>
              <textarea
                id="advanced-meta"
                className="w-full h-32 p-2 border rounded font-mono"
                value={settings.advanced.metaTags}
                onChange={e => handleChange('advanced', 'metaTags', e.target.value)}
                placeholder="Add custom meta tags..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanced-classes">Custom Classes</Label>
              <Input
                id="advanced-classes"
                value={settings.advanced.customClasses}
                onChange={e => handleChange('advanced', 'customClasses', e.target.value)}
                placeholder="Add custom CSS classes..."
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 