import { Session } from 'next-auth';

export type Resource =
  | 'pages'
  | 'products'
  | 'research'
  | 'analytics'
  | 'users'
  | 'settings'
  | 'templates'
  | 'courses'
  | 'assignments'
  | 'badges'
  | 'certificates'
  | 'content'
  | 'media'
  | 'comments'
  | 'notifications'
  | 'reports';

export type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'manage'
  | 'assign'
  | 'review'
  | 'approve'
  | 'reject'
  | 'export'
  | 'import'
  | 'configure';

export type UserRole =
  | 'user'
  | 'researcher'
  | 'editor'
  | 'instructor'
  | 'moderator'
  | 'analyst'
  | 'admin'
  | 'super_admin';

interface Permission {
  action: Action;
  resource: Resource;
  conditions?: {
    ownerOnly?: boolean;
    teamOnly?: boolean;
    statusIn?: string[];
    roleIn?: UserRole[];
    hasTag?: string[];
    customCheck?: (context: any) => boolean;
  };
}

type RolePermissions = Record<UserRole, Permission[]>;

const rolePermissions: RolePermissions = {
  super_admin: [
    { action: 'manage', resource: 'pages' },
    { action: 'manage', resource: 'products' },
    { action: 'manage', resource: 'research' },
    { action: 'manage', resource: 'analytics' },
    { action: 'manage', resource: 'users' },
    { action: 'manage', resource: 'settings' },
    { action: 'manage', resource: 'templates' },
    { action: 'manage', resource: 'courses' },
    { action: 'manage', resource: 'assignments' },
    { action: 'manage', resource: 'badges' },
    { action: 'manage', resource: 'certificates' },
    { action: 'manage', resource: 'content' },
    { action: 'manage', resource: 'media' },
    { action: 'manage', resource: 'comments' },
    { action: 'manage', resource: 'notifications' },
    { action: 'manage', resource: 'reports' }
  ],

  admin: [
    { action: 'manage', resource: 'pages' },
    { action: 'manage', resource: 'products' },
    { action: 'manage', resource: 'research' },
    { action: 'read', resource: 'analytics' },
    { action: 'manage', resource: 'users', conditions: { roleIn: ['user', 'researcher', 'editor', 'instructor'] } },
    { action: 'manage', resource: 'templates' },
    { action: 'manage', resource: 'courses' },
    { action: 'manage', resource: 'assignments' },
    { action: 'manage', resource: 'badges' },
    { action: 'manage', resource: 'certificates' },
    { action: 'manage', resource: 'content' },
    { action: 'manage', resource: 'media' },
    { action: 'manage', resource: 'comments' },
    { action: 'manage', resource: 'notifications' }
  ],

  analyst: [
    { action: 'read', resource: 'pages' },
    { action: 'read', resource: 'products' },
    { action: 'read', resource: 'research' },
    { action: 'manage', resource: 'analytics' },
    { action: 'read', resource: 'users' },
    { action: 'manage', resource: 'reports' }
  ],

  moderator: [
    { action: 'read', resource: 'pages' },
    { action: 'read', resource: 'products' },
    { action: 'read', resource: 'research' },
    { action: 'manage', resource: 'comments' },
    { action: 'manage', resource: 'notifications' },
    { action: 'read', resource: 'reports' }
  ],

  instructor: [
    { action: 'read', resource: 'pages' },
    { action: 'read', resource: 'products' },
    { action: 'read', resource: 'research' },
    { action: 'manage', resource: 'courses', conditions: { ownerOnly: true } },
    { action: 'manage', resource: 'assignments', conditions: { ownerOnly: true } },
    { action: 'manage', resource: 'certificates', conditions: { ownerOnly: true } },
    { action: 'read', resource: 'analytics', conditions: { ownerOnly: true } }
  ],

  editor: [
    { action: 'read', resource: 'pages' },
    { action: 'update', resource: 'pages' },
    { action: 'publish', resource: 'pages' },
    { action: 'unpublish', resource: 'pages' },
    { action: 'read', resource: 'products' },
    { action: 'update', resource: 'products' },
    { action: 'read', resource: 'research' },
    { action: 'update', resource: 'research' },
    { action: 'manage', resource: 'content' },
    { action: 'manage', resource: 'media' }
  ],

  researcher: [
    { action: 'read', resource: 'pages' },
    { action: 'read', resource: 'products' },
    { action: 'manage', resource: 'research', conditions: { ownerOnly: true } },
    { action: 'read', resource: 'analytics' },
    { action: 'create', resource: 'content' },
    { action: 'update', resource: 'content', conditions: { ownerOnly: true } }
  ],

  user: [
    { action: 'read', resource: 'pages' },
    { action: 'read', resource: 'products' },
    { action: 'read', resource: 'research' },
    { action: 'create', resource: 'comments' },
    { action: 'update', resource: 'comments', conditions: { ownerOnly: true } },
    { action: 'delete', resource: 'comments', conditions: { ownerOnly: true } }
  ]
};

export function can(
  session: Session | null,
  action: Action,
  resource: Resource,
  context?: any
): boolean {
  if (!session?.user) return false;

  const role = session.user.role as UserRole;
  const permissions = rolePermissions[role] || [];

  // Super admin has full access
  if (role === 'super_admin') return true;

  // Check if user has the required permission
  const hasPermission = permissions.some(permission => {
    // Check if action and resource match
    const actionMatches = permission.action === action || permission.action === 'manage';
    const resourceMatches = permission.resource === resource;

    if (!actionMatches || !resourceMatches) return false;

    // If no conditions, permission is granted
    if (!permission.conditions) return true;

    // Check conditions
    const {
      ownerOnly,
      teamOnly,
      statusIn,
      roleIn,
      hasTag,
      customCheck
    } = permission.conditions;

    if (!context) return !ownerOnly && !teamOnly && !statusIn && !roleIn && !hasTag && !customCheck;

    // Check owner condition
    if (ownerOnly && context.userId !== session.user.id) return false;

    // Check team condition
    if (teamOnly && !context.teamIds?.includes(session.user.teamId)) return false;

    // Check status condition
    if (statusIn && !statusIn.includes(context.status)) return false;

    // Check role condition
    if (roleIn && !roleIn.includes(context.role)) return false;

    // Check tag condition
    if (hasTag && !hasTag.some(tag => context.tags?.includes(tag))) return false;

    // Check custom condition
    if (customCheck && !customCheck(context)) return false;

    return true;
  });

  return hasPermission;
}

export function requireRole(session: Session | null, minimumRole: UserRole): boolean {
  if (!session?.user) return false;

  const roleHierarchy: UserRole[] = [
    'user',
    'researcher',
    'editor',
    'instructor',
    'moderator',
    'analyst',
    'admin',
    'super_admin'
  ];

  const userRoleIndex = roleHierarchy.indexOf(session.user.role as UserRole);
  const requiredRoleIndex = roleHierarchy.indexOf(minimumRole);

  return userRoleIndex >= requiredRoleIndex;
}

export function getPermittedActions(
  session: Session | null,
  resource: Resource,
  context?: any
): Action[] {
  if (!session?.user) return [];

  const role = session.user.role as UserRole;
  const permissions = rolePermissions[role] || [];

  // Super admin has all actions
  if (role === 'super_admin') {
    return ['create', 'read', 'update', 'delete', 'publish', 'unpublish', 'manage', 'assign', 'review', 'approve', 'reject', 'export', 'import', 'configure'];
  }

  return permissions
    .filter(permission => {
      const resourceMatches = permission.resource === resource;
      if (!resourceMatches) return false;

      // Check conditions if they exist
      if (permission.conditions && context) {
        const {
          ownerOnly,
          teamOnly,
          statusIn,
          roleIn,
          hasTag,
          customCheck
        } = permission.conditions;

        if (ownerOnly && context.userId !== session.user.id) return false;
        if (teamOnly && !context.teamIds?.includes(session.user.teamId)) return false;
        if (statusIn && !statusIn.includes(context.status)) return false;
        if (roleIn && !roleIn.includes(context.role)) return false;
        if (hasTag && !hasTag.some(tag => context.tags?.includes(tag))) return false;
        if (customCheck && !customCheck(context)) return false;
      }

      return true;
    })
    .map(permission => permission.action);
}

export function checkPagePermission(
  user: User,
  page: Page,
  action: 'edit' | 'delete'
): boolean {
  // Implementation with proper typing
} 