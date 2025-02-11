import { Session } from 'next-auth';

type UserRole = 'user' | 'researcher' | 'admin';

interface Permission {
  action: string;
  subject: string;
}

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { action: 'manage', subject: 'all' },
  ],
  researcher: [
    { action: 'read', subject: 'research' },
    { action: 'write', subject: 'research' },
    { action: 'read', subject: 'products' },
    { action: 'read', subject: 'analytics' },
  ],
  user: [
    { action: 'read', subject: 'research' },
    { action: 'read', subject: 'products' },
  ],
};

export function can(session: Session | null, action: string, subject: string): boolean {
  if (!session?.user) return false;

  const role = session.user.role as UserRole;
  const permissions = rolePermissions[role];

  // Admin has full access
  if (role === 'admin') return true;

  // Check if user has the required permission
  return permissions.some(permission => 
    (permission.action === action || permission.action === 'manage') &&
    (permission.subject === subject || permission.subject === 'all')
  );
}

export function requireRole(session: Session | null, minimumRole: UserRole): boolean {
  if (!session?.user) return false;

  const roleHierarchy: UserRole[] = ['user', 'researcher', 'admin'];
  const userRoleIndex = roleHierarchy.indexOf(session.user.role as UserRole);
  const requiredRoleIndex = roleHierarchy.indexOf(minimumRole);

  return userRoleIndex >= requiredRoleIndex;
} 