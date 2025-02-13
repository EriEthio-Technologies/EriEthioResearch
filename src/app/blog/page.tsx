import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | EriEthio Research',
  description: 'Latest research insights and updates from EriEthio Research.'
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="prose max-w-none">
        <p className="text-lg">Coming soon! Our blog will feature the latest research insights, case studies, and updates.</p>
      </div>
    </div>
  );
} 