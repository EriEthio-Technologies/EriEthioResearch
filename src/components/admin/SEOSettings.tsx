'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  structuredData?: string;
}

interface SEOSettingsProps {
  initialData?: SEOData;
  onUpdate: (data: SEOData) => Promise<void>;
}

export function SEOSettings({ initialData, onUpdate }: SEOSettingsProps) {
  const [data, setData] = useState<SEOData>(initialData || {
    title: '',
    description: '',
    keywords: [],
    ogImage: '',
    ogTitle: '',
    ogDescription: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    robots: 'index, follow',
    structuredData: ''
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof SEOData, value: string | string[]) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(data);
      toast.success('SEO settings saved successfully');
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast.error('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic SEO</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meta Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Page title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Page description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input
              id="keywords"
              value={data.keywords.join(', ')}
              onChange={e => handleChange('keywords', e.target.value.split(',').map(k => k.trim()))}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ogTitle">Open Graph Title</Label>
            <Input
              id="ogTitle"
              value={data.ogTitle}
              onChange={e => handleChange('ogTitle', e.target.value)}
              placeholder="Social media title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogDescription">Open Graph Description</Label>
            <Textarea
              id="ogDescription"
              value={data.ogDescription}
              onChange={e => handleChange('ogDescription', e.target.value)}
              placeholder="Social media description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImage">Open Graph Image URL</Label>
            <Input
              id="ogImage"
              value={data.ogImage}
              onChange={e => handleChange('ogImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterCard">Twitter Card Type</Label>
            <Input
              id="twitterCard"
              value={data.twitterCard}
              onChange={e => handleChange('twitterCard', e.target.value)}
              placeholder="summary_large_image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterTitle">Twitter Title</Label>
            <Input
              id="twitterTitle"
              value={data.twitterTitle}
              onChange={e => handleChange('twitterTitle', e.target.value)}
              placeholder="Twitter title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterDescription">Twitter Description</Label>
            <Textarea
              id="twitterDescription"
              value={data.twitterDescription}
              onChange={e => handleChange('twitterDescription', e.target.value)}
              placeholder="Twitter description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterImage">Twitter Image URL</Label>
            <Input
              id="twitterImage"
              value={data.twitterImage}
              onChange={e => handleChange('twitterImage', e.target.value)}
              placeholder="https://example.com/twitter-image.jpg"
            />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">Canonical URL</Label>
            <Input
              id="canonicalUrl"
              value={data.canonicalUrl}
              onChange={e => handleChange('canonicalUrl', e.target.value)}
              placeholder="https://example.com/canonical-page"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="robots">Robots Meta Tag</Label>
            <Input
              id="robots"
              value={data.robots}
              onChange={e => handleChange('robots', e.target.value)}
              placeholder="index, follow"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="structuredData">Structured Data (JSON-LD)</Label>
            <Textarea
              id="structuredData"
              value={data.structuredData}
              onChange={e => handleChange('structuredData', e.target.value)}
              placeholder="Paste your JSON-LD structured data here"
              className="font-mono"
              rows={10}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </Button>
      </div>
    </Card>
  );
} 