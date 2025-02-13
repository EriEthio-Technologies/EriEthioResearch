'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/db/types';
import { supabaseAdmin } from '@/lib/supabase';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const roleColors = {
  admin: 'text-red-500',
  researcher: 'text-yellow-500',
  user: 'text-green-500'
};

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  async function handleDeleteUser(id: string, email: string) {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const { error } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete auth user
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (authError) throw authError;

      setUsers(users.filter(user => user.id !== id));

      // Log activity
      await supabaseAdmin.from('admin_activity').insert({
        type: 'user_deleted',
        description: `User ${email} was deleted`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async function handleUpdateRole(id: string, newRole: UserRole, email: string) {
    try {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ role: newRole })
        .eq('id', id);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === id ? { ...user, role: newRole } : user
      ));

      // Log activity
      await supabaseAdmin.from('admin_activity').insert({
        type: 'user_role_updated',
        description: `User ${email}'s role was updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1 
          className="text-4xl font-bold text-neon-cyan"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Users Management
        </motion.h1>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
          onClick={() => router.push('/admin/users/new')}
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </motion.button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neon-cyan/20">
                <th className="px-6 py-4 text-left text-neon-magenta">User</th>
                <th className="px-6 py-4 text-left text-neon-magenta">Role</th>
                <th className="px-6 py-4 text-left text-neon-magenta">Created</th>
                <th className="px-6 py-4 text-right text-neon-magenta">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  variants={item}
                  className="border-b border-neon-cyan/10 hover:bg-black/20"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-300">{user.full_name || 'No name'}</span>
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole, user.email)}
                      className={`px-3 py-1 rounded-full bg-black/30 border border-neon-cyan/20 ${roleColors[user.role]} focus:outline-none focus:border-neon-cyan`}
                    >
                      <option value="user">User</option>
                      <option value="researcher">Researcher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-neon-magenta transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
} 