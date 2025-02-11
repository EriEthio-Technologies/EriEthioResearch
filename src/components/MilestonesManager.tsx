import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Flag, Plus, Trash2, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Milestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  completed_date: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  project_id: string;
  created_at: string;
}

interface MilestonesManagerProps {
  projectId: string;
}

const priorityColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500'
};

const statusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
  overdue: AlertCircle
};

const statusColors = {
  pending: 'text-yellow-500',
  in_progress: 'text-blue-500',
  completed: 'text-green-500',
  overdue: 'text-red-500'
};

export default function MilestonesManager({ projectId }: MilestonesManagerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Milestone, 'id' | 'created_at' | 'completed_date'>>({
    title: '',
    description: '',
    due_date: new Date().toISOString().split('T')[0],
    status: 'pending',
    priority: 'medium',
    project_id: projectId,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  async function fetchMilestones() {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      // Update status based on due date and completion
      const updatedMilestones = data?.map(milestone => ({
        ...milestone,
        status: getStatus(milestone)
      })) || [];

      setMilestones(updatedMilestones);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatus(milestone: Milestone): Milestone['status'] {
    if (milestone.completed_date) return 'completed';
    if (milestone.status === 'in_progress') return 'in_progress';
    if (new Date(milestone.due_date) < new Date()) return 'overdue';
    return 'pending';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { error } = await supabase
        .from('milestones')
        .insert([formData]);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'milestone_added',
        description: `New milestone "${formData.title}" was added to project ${projectId}`,
      });

      setShowAddForm(false);
      setFormData({
        title: '',
        description: '',
        due_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        priority: 'medium',
        project_id: projectId,
      });
      fetchMilestones();
    } catch (error) {
      console.error('Error adding milestone:', error);
      setError('Failed to add milestone');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'milestone_deleted',
        description: `Milestone "${title}" was deleted from project ${projectId}`,
      });

      fetchMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Milestone['status'], title: string) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .update({
          status: newStatus,
          completed_date: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'milestone_status_updated',
        description: `Milestone "${title}" status was updated to ${newStatus}`,
      });

      fetchMilestones();
    } catch (error) {
      console.error('Error updating milestone status:', error);
    }
  };

  if (loading) {
    return <div className="text-neon-cyan">Loading milestones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-neon-magenta">Project Milestones</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Milestone</span>
        </button>
      </div>

      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 space-y-4"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-neon-magenta mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-neon-magenta mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-neon-magenta mb-2">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Milestone['priority'] })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-neon-magenta mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Milestone['status'] })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
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
              Add Milestone
            </button>
          </div>
        </motion.form>
      )}

      {/* Timeline visualization */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-neon-cyan/20"></div>
        <div className="space-y-6">
          {milestones.map((milestone) => {
            const StatusIcon = statusIcons[milestone.status];
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative pl-16"
              >
                {/* Timeline node */}
                <div className="absolute left-6 top-3 w-4 h-4 rounded-full bg-black border-2 border-neon-cyan"></div>

                <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-neon-magenta flex items-center space-x-2">
                        <Flag className={`w-5 h-5 ${priorityColors[milestone.priority]}`} />
                        <span>{milestone.title}</span>
                      </h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={milestone.status}
                        onChange={(e) => handleUpdateStatus(milestone.id, e.target.value as Milestone['status'], milestone.title)}
                        className={`px-3 py-1 rounded-full bg-black/30 border border-neon-cyan/20 ${statusColors[milestone.status]} focus:outline-none focus:border-neon-cyan`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => handleDelete(milestone.id, milestone.title)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neon-magenta" />
                      <span className="text-gray-400">Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`w-4 h-4 ${statusColors[milestone.status]}`} />
                      <span className={statusColors[milestone.status]}>
                        {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                      </span>
                    </div>
                    {milestone.completed_date && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-400">
                          Completed: {new Date(milestone.completed_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 