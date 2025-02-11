'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ResearchProjectForm } from '@/components/forms/research-project-form';
import type { ResearchProject } from '@/lib/db/types';

interface ResearchProjectDialogProps {
  project?: ResearchProject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ResearchProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: ResearchProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Research Project' : 'Create Research Project'}
          </DialogTitle>
          <DialogDescription>
            {project
              ? 'Make changes to your research project here.'
              : 'Add a new research project to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <ResearchProjectForm
          project={project}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
} 