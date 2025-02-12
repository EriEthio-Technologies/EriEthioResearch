import ResearchCategoryClient from './ResearchCategoryClient';

export async function generateStaticParams() {
  return [
    { category: 'active-projects' },
    { category: 'publications' },
    { category: 'collaborations' }
  ];
}

export default function ResearchCategoryPage() {
  return <ResearchCategoryClient />;
} 