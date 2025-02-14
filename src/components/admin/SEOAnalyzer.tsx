'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Content } from '@/types/content';

export function SEOAnalyzer({ content }: { content: Content }) {
  const seoData = useMemo(() => analyzeSEO(content), [content]);

  return (
    <div className="p-4 bg-gray-900 rounded-lg space-y-4">
      <h3 className="text-neon-cyan font-semibold">SEO Analysis</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Title Length</span>
          <Badge variant={seoData.titleScore >= 80 ? 'success' : 'warning'}>
            {seoData.titleLength} / 60
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span>Slug Structure</span>
          <Badge variant={seoData.slugValid ? 'success' : 'warning'}>
            {seoData.slugValid ? 'Valid' : 'Improve'}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span>Meta Description</span>
          <Badge variant={seoData.descScore >= 80 ? 'success' : 'warning'}>
            {seoData.descLength} / 160
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span>Domain Inclusion</span>
          <Badge variant={seoData.fullUrlValid ? 'success' : 'warning'}>
            {seoData.fullUrlValid ? 'Valid' : 'Missing'}
          </Badge>
        </div>
      </div>

      {seoData.recommendations.length > 0 && (
        <div className="pt-4 border-t border-neon-cyan/10">
          <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
          <ul className="list-disc pl-4 space-y-1 text-sm">
            {seoData.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function analyzeSEO(content: Content) {
  const titleLength = content.title.length;
  const descLength = content.description?.length || 0;
  const slugValid = /^[a-z0-9-]+$/.test(content.slug);
  
  const recommendations = [];
  if (titleLength < 30) recommendations.push("Title is too short (aim for 30-60 characters)");
  if (titleLength > 60) recommendations.push("Title is too long (aim for 30-60 characters)");
  if (!slugValid) recommendations.push("Slug should only contain lowercase letters, numbers, and hyphens");
  if (descLength < 120) recommendations.push("Description could be more detailed (aim for 120-160 characters)");
  if (descLength > 160) recommendations.push("Description is too long (aim for 120-160 characters)");

  const domain = 'eriethio.com';
  const fullUrlValid = content.slug.includes(domain);

  if (!fullUrlValid) {
    recommendations.push(`Include domain (${domain}) in slug for better SEO`);
  }

  return {
    titleLength,
    titleScore: Math.min(100, Math.floor((titleLength / 60) * 100)),
    descLength,
    descScore: Math.min(100, Math.floor((descLength / 160) * 100)),
    slugValid,
    recommendations,
    fullUrlValid,
    domain
  };
} 