'use client';

import { useEffect, useState } from 'react';
import { getResearchProjects } from '@/lib/db';
import type { ResearchProject } from '@/lib/db/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResearchProjectDialog } from '@/components/dialogs/research-project-dialog';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function ResearchHubPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getResearchProjects(status || undefined);
        setProjects(data);
      } catch (error) {
        console.error('Error loading research projects:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, [status]);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    project.description.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading research projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Research Hub</h1>
        <div className="flex items-center gap-4">
          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Projects</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)}>New Project</Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => router.push(`/research/${project.slug}`)}
          >
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                {project.status}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">
                  {project.start_date && (
                    <span>
                      Started: {new Date(project.start_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No research projects found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {status
              ? `No projects with status "${status}"`
              : search
              ? 'No projects match your search'
              : 'Start by creating a new research project'}
          </p>
        </div>
      )}

      <ResearchProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
} 