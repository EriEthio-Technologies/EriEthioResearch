'use client';

import type { Content } from '@/types/content';

export const StructuredData = ({ content }: { content: Content }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': content.type === 'blog' ? 'BlogPosting' : 'CreativeWork',
    headline: content.title,
    description: content.description,
    datePublished: content.published_at,
    author: {
      '@type': 'Organization',
      name: 'EriEthio Research'
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
}; 