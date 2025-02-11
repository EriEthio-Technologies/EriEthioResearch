'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/db';
import type { ResearchProject, ResearchProjectMember, UserProfile } from '@/lib/db/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResearchProjectDialog } from '@/components/dialogs/research-project-dialog';
import { format } from 'date-fns';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectWithMembers extends ResearchProject {
  research_project_members: (ResearchProjectMember & {
    user_profiles: UserProfile;
  })[];
}

export default function ResearchProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function loadProject() {
      try {
        const { data, error } = await supabase
          .from('research_projects')
          .select(`
            *,
            research_project_members (
              *,
              user_profiles (*)
            )
          `)
          .eq('slug', params.slug)
          .single();

        if (error) throw error;
        setProject(data as ProjectWithMembers);
      } catch (error) {
        console.error('Error loading project:', error);
        router.push('/research');
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [params.slug, router]);

  async function handleDelete() {
    if (!project) return;

    try {
      const { error } = await supabase
        .from('research_projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;
      router.push('/research');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }

  if (isLoading) {
    return <div>Loading project...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="text-muted-foreground">{project.status}</p>
            </div>
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            {project.methodology && (
              <div>
                <h3 className="font-medium">Methodology</h3>
                <p className="text-muted-foreground">{project.methodology}</p>
              </div>
            )}
            {project.findings && (
              <div>
                <h3 className="font-medium">Findings</h3>
                <p className="text-muted-foreground">{project.findings}</p>
              </div>
            )}
            <div className="flex justify-between">
              {project.start_date && (
                <div>
                  <h3 className="font-medium">Start Date</h3>
                  <p className="text-muted-foreground">
                    {format(new Date(project.start_date), 'PPP')}
                  </p>
                </div>
              )}
              {project.end_date && (
                <div>
                  <h3 className="font-medium">End Date</h3>
                  <p className="text-muted-foreground">
                    {format(new Date(project.end_date), 'PPP')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.research_project_members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">
                      {member.user_profiles.full_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ResearchProjectDialog
        project={project}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              research project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 