import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { UserRole } from '@/lib/db/types';

interface UserFormData {
  email: string;
  full_name: string;
  role: UserRole;
  password?: string;
}

interface UserFormProps {
  initialData?: Omit<UserFormData, 'password'>;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

const defaultUser: UserFormData = {
  email: '',
  full_name: '',
  role: 'user',
  password: '',
};

export default function UserForm({ initialData, onSubmit, isLoading, mode }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>(
    mode === 'edit' 
      ? { ...defaultUser, ...initialData }
      : defaultUser
  );
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({ ...defaultUser, ...initialData });
    }
  }, [initialData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'create' && !formData.password) {
      setError('Password is required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-neon-magenta mb-2">Full Name</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            required
            disabled={mode === 'edit'}
          />
        </div>

        {mode === 'create' && (
          <div>
            <label className="block text-neon-magenta mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              required
              minLength={8}
            />
          </div>
        )}

        <div>
          <label className="block text-neon-magenta mb-2">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          >
            <option value="user">User</option>
            <option value="researcher">Researcher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
        </motion.button>
      </div>
    </form>
  );
} 