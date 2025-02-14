'use client';

import { useState, useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Section } from './EditorSection';
import { createPortal } from 'react-dom';
import { SectionType } from '@/types/page';

export default function VisualEditor({ initialSections }: { initialSections: SectionType[] }) {
  const [sections, setSections] = useState<SectionType[]>(initialSections);
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);

  const handleDragStart = useCallback((event: any) => {
    setActiveSection(event.active.data.current?.section);
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (!over) return;

    setSections((sections) => {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      return arrayMove(sections, oldIndex, newIndex);
    });
  }, []);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map(s => s.id)}>
        <div className="space-y-4 p-4 bg-gray-900 rounded-lg">
          {sections.map(section => (
            <Section
              key={section.id}
              section={section}
              onUpdate={(updated) => setSections(prev => 
                prev.map(s => s.id === updated.id ? updated : s)
              )}
              onRemove={() => setSections(prev => 
                prev.filter(s => s.id !== section.id)
              )}
            />
          ))}
        </div>
      </SortableContext>

      {typeof window !== 'undefined' && createPortal(
        <DragOverlay>
          {activeSection && <Section section={activeSection} isDragging />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
} 