// Role-based access with implicit enums — hard to type

const PERMISSION_MAP = {
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

export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  const perms = PERMISSION_MAP[userRole];
  if (!perms) return false;
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

export function canEditTask(user, task) {
  if (!user || !task) return false;
  if (user.role === 'admin' || user.role === 'owner') return true;
  if (task.assigneeId === user.id) return true;
  if (task.createdBy === user.id) return true;
  return hasPermission(user.role, 'task:write');
}

export function canDeleteTask(user, task) {
  if (!user || !task) return false;
  if (user.role === 'admin' || user.role === 'owner') return true;
  if (task.createdBy === user.id) return hasPermission(user.role, 'task:delete');
  return false;
}

export function getHighestRole(roles) {
  const hierarchy = ['owner', 'admin', 'member', 'viewer'];
  for (const role of hierarchy) {
    if (roles.includes(role)) return role;
  }
  return 'viewer';
}
