import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Users, Plus, Trash2, UserPlus, UserMinus, Shield } from 'lucide-react';
import BulkActionsMenu from './BulkActionsMenu';
import type { ProjectMemberRole } from '@/lib/db/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Collaborator {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface CollaboratorsManagerProps {
  projectId: string;
  leadResearcherId: string;
}

const roleColors = {
  lead: 'text-red-500',
  researcher: 'text-yellow-500',
  contributor: 'text-green-500',
  advisor: 'text-blue-500'
};

export default function CollaboratorsManager({ projectId, leadResearcherId }: CollaboratorsManagerProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [availableResearchers, setAvailableResearchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState('');
  const [selectedRole, setSelectedRole] = useState<ProjectMemberRole>('researcher');
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);

  const fetchCollaborators = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('project_collaborators')
        .select(`
          id,
          role,
          joined_date,
          researcher:profiles(id, full_name, email)
        `)
        .eq('project_id', projectId);

      if (error) throw error;

      const formattedCollaborators = data?.map(item => ({
        id: item.id,
        full_name: item.researcher.full_name,
        email: item.researcher.email,
        role: item.role,
        joined_date: item.joined_date
      })) || [];

      setCollaborators(formattedCollaborators);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchAvailableResearchers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'researcher')
        .not('id', 'in', (query) =>
          query
            .from('project_collaborators')
            .select('researcher_id')
            .eq('project_id', projectId)
        );

      if (error) throw error;
      setAvailableResearchers(data || []);
    } catch (error) {
      console.error('Error fetching available researchers:', error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchCollaborators();
    fetchAvailableResearchers();
  }, [fetchCollaborators, fetchAvailableResearchers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResearcher) return;

    try {
      const { error } = await supabase
        .from('project_collaborators')
        .insert([
          {
            project_id: projectId,
            researcher_id: selectedResearcher,
            role: selectedRole,
            joined_date: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'collaborator_added',
        description: `New collaborator was added to project ${projectId}`,
      });

      setShowAddForm(false);
      setSelectedResearcher('');
      setSelectedRole('researcher');
      fetchCollaborators();
      fetchAvailableResearchers();
    } catch (error) {
      console.error('Error adding collaborator:', error);
    }
  };

  const handleBulkAction = async (action: string, data?: any) => {
    try {
      switch (action) {
        case 'remove':
          const { error: removeError } = await supabase
            .from('project_collaborators')
            .delete()
            .in('id', selectedCollaborators);
          
          if (removeError) throw removeError;

          // Log activity
          await supabase.from('admin_activity').insert({
            type: 'collaborators_bulk_removed',
            description: `${selectedCollaborators.length} collaborators were removed from project ${projectId}`,
          });
          break;

        case 'role':
          const { error: roleError } = await supabase
            .from('project_collaborators')
            .update({ role: data })
            .in('id', selectedCollaborators);
          
          if (roleError) throw roleError;

          // Log activity
          await supabase.from('admin_activity').insert({
            type: 'collaborators_bulk_role_updated',
            description: `Role updated to "${data}" for ${selectedCollaborators.length} collaborators in project ${projectId}`,
          });
          break;
      }

      // Refresh collaborators list
      fetchCollaborators();
      // Clear selection
      setSelectedCollaborators([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const bulkActions = [
    {
      name: 'remove',
      label: 'Remove Selected',
      icon: UserMinus,
      requiresConfirmation: true,
    },
    {
      name: 'role',
      label: 'Update Role',
      icon: Shield,
      requiresInput: true,
      inputType: 'select',
      options: ['researcher', 'contributor', 'reviewer'],
    },
  ];

  const toggleCollaboratorSelection = (collaboratorId: string) => {
    setSelectedCollaborators(prev =>
      prev.includes(collaboratorId)
        ? prev.filter(id => id !== collaboratorId)
        : [...prev, collaboratorId]
    );
  };

  const toggleAllCollaborators = () => {
    setSelectedCollaborators(prev =>
      prev.length === collaborators.length ? [] : collaborators.map(c => c.id)
    );
  };

  if (loading) {
    return <div className="text-neon-cyan">Loading collaborators...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-neon-magenta">Project Collaborators</h2>
        <div className="flex items-center space-x-4">
          <BulkActionsMenu
            selectedItems={selectedCollaborators}
            onBulkAction={handleBulkAction}
            actions={bulkActions}
          />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Collaborator</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neon-magenta mb-2">Researcher</label>
              <select
                value={selectedResearcher}
                onChange={(e) => setSelectedResearcher(e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                required
              >
                <option value="">Select a researcher</option>
                {availableResearchers.map((researcher) => (
                  <option key={researcher.id} value={researcher.id}>
                    {researcher.full_name} ({researcher.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as ProjectMemberRole)}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              >
                <option value="researcher">Researcher</option>
                <option value="contributor">Contributor</option>
                <option value="reviewer">Reviewer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-500/20 text-gray-300 border border-gray-500 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
            >
              Add Collaborator
            </button>
          </div>
        </motion.form>
      )}

      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neon-cyan/20">
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedCollaborators.length === collaborators.length}
                  onChange={toggleAllCollaborators}
                  className="rounded border-neon-cyan/20 text-neon-magenta focus:ring-neon-magenta"
                />
              </th>
              <th className="px-6 py-3 text-left text-neon-magenta">Name</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Email</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Role</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Joined Date</th>
              <th className="px-6 py-3 text-left text-neon-magenta">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collaborators.map((collaborator) => (
              <tr
                key={collaborator.id}
                className="border-b border-neon-cyan/10 hover:bg-neon-cyan/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedCollaborators.includes(collaborator.id)}
                    onChange={() => toggleCollaboratorSelection(collaborator.id)}
                    className="rounded border-neon-cyan/20 text-neon-magenta focus:ring-neon-magenta"
                    disabled={collaborator.id === leadResearcherId}
                  />
                </td>
                <td className="px-6 py-4 text-gray-300">{collaborator.full_name}</td>
                <td className="px-6 py-4 text-gray-300">{collaborator.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${collaborator.role === 'researcher' ? 'bg-blue-100 text-blue-800' :
                      collaborator.role === 'contributor' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'}`}
                  >
                    {collaborator.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(collaborator.joined_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {collaborator.id !== leadResearcherId && (
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to remove this collaborator?')) {
                          try {
                            const { error } = await supabase
                              .from('project_collaborators')
                              .delete()
                              .eq('id', collaborator.id);

                            if (error) throw error;

                            // Log activity
                            await supabase.from('admin_activity').insert({
                              type: 'collaborator_removed',
                              description: `Collaborator "${collaborator.full_name}" was removed from project ${projectId}`,
                            });

                            fetchCollaborators();
                            fetchAvailableResearchers();
                          } catch (error) {
                            console.error('Error removing collaborator:', error);
                          }
                        }
                      }}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 