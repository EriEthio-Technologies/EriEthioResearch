'use client';

import { motion } from 'framer-motion';
import { HeroSection } from '@/components/ui/hero-section';
import { FeatureGrid } from '@/components/ui/feature-grid';
import { FlipCard } from '@/components/ui/FlipCard';
import { iconMap } from '@/lib/icons';

interface PageSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'video' | 'grid' | 'columns' | 'cards' | 'markdown';
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

interface PageRendererProps {
  sections: PageSection[];
  isEditing?: boolean;
  onSectionClick?: (section: PageSection) => void;
}

export default function PageRenderer({
  sections,
  isEditing = false,
  onSectionClick
}: PageRendererProps) {
  const renderSection = (section: PageSection) => {
    const commonProps = {
      key: section.id,
      onClick: isEditing ? () => onSectionClick?.(section) : undefined,
      className: `${isEditing ? 'cursor-pointer hover:outline hover:outline-neon-cyan/50' : ''}`
    };

    switch (section.type) {
      case 'hero':
        return (
          <div {...commonProps}>
            <HeroSection
              title={section.content.title}
              subtitle={section.content.subtitle}
              buttons={section.content.buttons}
              align={section.settings.alignment}
              background={section.settings.background}
            />
          </div>
        );

      case 'grid':
        return (
          <div {...commonProps}>
            <FeatureGrid
              title={section.content.title}
              items={section.content.items.map((item: any) => ({
                ...item,
                icon: iconMap[item.icon as keyof typeof iconMap]
              }))}
              columns={section.settings.columns}
              gap={section.settings.gap}
              padding={section.settings.padding}
            />
          </div>
        );

      case 'cards':
        return (
          <div {...commonProps}>
            <section className="mt-24">
              <h2 className="text-3xl font-bold text-neon-cyan mb-12 text-center">
                {section.content.title}
              </h2>
              <div className={`grid grid-cols-1 md:grid-cols-${section.settings.columns || 3} gap-8 justify-items-center`}>
                {section.content.items.map((card: any, index: number) => (
                  <FlipCard
                    key={index}
                    {...card}
                  />
                ))}
              </div>
            </section>
          </div>
        );

      case 'text':
        return (
          <motion.div
            {...commonProps}
            className={`prose prose-invert max-w-none ${section.settings.alignment === 'center' ? 'text-center' : ''} ${commonProps.className}`}
            style={{
              color: section.settings.textColor,
              padding: section.settings.padding
            }}
            dangerouslySetInnerHTML={{ __html: section.content.text }}
          />
        );

      case 'markdown':
        return (
          <div {...commonProps}>
            {/* Add markdown renderer component here */}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {sections.map(section => renderSection(section))}
    </div>
  );
} 