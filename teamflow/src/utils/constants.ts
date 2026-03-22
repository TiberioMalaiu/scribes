export const TASK_STATUSES = ['backlog', 'todo', 'in_progress', 'in_review', 'done'] as const;

export const TASK_PRIORITIES = ['none', 'low', 'medium', 'high', 'urgent'] as const;

export const PROJECT_ROLES = ['viewer', 'member', 'admin', 'owner'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type ProjectRole = (typeof PROJECT_ROLES)[number];

// Someone added these as an object instead of an array — inconsistency
export const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: '#9ca3af',
  todo: '#6b7280',
  in_progress: '#3b82f6',
  in_review: '#f59e0b',
  done: '#10b981',
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  none: '#d1d5db',
  low: '#6ee7b7',
  medium: '#fbbf24',
  high: '#f97316',
  urgent: '#ef4444',
};

export const API_TIMEOUT = 10000;
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'] as const;
