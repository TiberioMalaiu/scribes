// Role-based access with implicit enums — hard to type
import type { ProjectRole } from './constants';

type Permission =
  | '*'
  | 'project:read' | 'project:write' | 'project:delete' | 'project:settings'
  | 'task:read' | 'task:write' | 'task:delete' | 'task:assign'
  | 'member:read' | 'member:invite' | 'member:remove' | 'member:role'
  | 'analytics:read' | 'analytics:export';

interface PermissionUser {
  id: string;
  role: ProjectRole;
}

interface PermissionTask {
  assigneeId: string;
  createdBy: string;
}

const PERMISSION_MAP: Record<ProjectRole, Permission[]> = {
  owner: ['*'],
  admin: [
    'project:read', 'project:write', 'project:delete', 'project:settings',
    'task:read', 'task:write', 'task:delete', 'task:assign',
    'member:read', 'member:invite', 'member:remove', 'member:role',
    'analytics:read', 'analytics:export',
  ],
  member: [
    'project:read', 'project:write',
    'task:read', 'task:write', 'task:assign',
    'member:read',
    'analytics:read',
  ],
  viewer: [
    'project:read',
    'task:read',
    'member:read',
  ],
};

export function hasPermission(userRole: ProjectRole | null | undefined, permission: Permission | null | undefined): boolean {
  if (!userRole || !permission) return false;
  const perms = PERMISSION_MAP[userRole];
  if (!perms) return false;
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

export function canEditTask(user: PermissionUser | null | undefined, task: PermissionTask | null | undefined): boolean {
  if (!user || !task) return false;
  if (user.role === 'admin' || user.role === 'owner') return true;
  if (task.assigneeId === user.id) return true;
  if (task.createdBy === user.id) return true;
  return hasPermission(user.role, 'task:write');
}

export function canDeleteTask(user: PermissionUser | null | undefined, task: PermissionTask | null | undefined): boolean {
  if (!user || !task) return false;
  if (user.role === 'admin' || user.role === 'owner') return true;
  if (task.createdBy === user.id) return hasPermission(user.role, 'task:delete');
  return false;
}

export function getHighestRole(roles: ProjectRole[]): ProjectRole {
  const hierarchy: ProjectRole[] = ['owner', 'admin', 'member', 'viewer'];
  for (const role of hierarchy) {
    if (roles.includes(role)) return role;
  }
  return 'viewer';
}
