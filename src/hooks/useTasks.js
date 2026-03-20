import { useState, useEffect, useCallback } from 'react';
import { getTasks, updateTask, deleteTask } from '../api/tasks';

// HACK: seed data for development — remove when backend is ready
const SEED_TASKS = [
  { id: 'tsk_a1b2c3', title: 'Fix login redirect loop on expired sessions', description: 'Users are getting stuck in a redirect loop when their JWT expires mid-session. Need to handle 401s gracefully in the axios interceptor.', status: 'in_progress', priority: 'high', points: 5, assignee: { id: 'usr_001', name: 'Sarah Chen' }, assigneeId: 'usr_001', createdBy: 'usr_002', dueDate: '2026-03-22', createdAt: '2026-03-10T09:00:00Z', comments: [] },
  { id: 'tsk_d4e5f6', title: 'Add pagination to task list endpoint', description: 'The /tasks endpoint returns everything. Need to add limit/offset params and return total count.', status: 'todo', priority: 'medium', points: 3, assignee: { id: 'usr_002', name: 'Alex Rivera' }, assigneeId: 'usr_002', createdBy: 'usr_001', dueDate: '2026-03-25', createdAt: '2026-03-12T14:30:00Z', comments: [] },
  { id: 'tsk_g7h8i9', title: 'Migrate Button component to Tailwind', description: 'Button still uses inline styles from Year 1. Should use Tailwind classes for consistency with newer components.', status: 'backlog', priority: 'low', points: 2, assignee: null, assigneeId: null, createdBy: 'usr_005', dueDate: null, createdAt: '2026-03-08T11:00:00Z', comments: [] },
  { id: 'tsk_j0k1l2', title: 'Dashboard stats show wrong "completed this week" count', description: 'The completed count includes tasks from previous sprints that were moved to done during data cleanup.', status: 'in_review', priority: 'high', points: 3, assignee: { id: 'usr_003', name: 'Jordan Lee' }, assigneeId: 'usr_003', createdBy: 'usr_001', dueDate: '2026-03-20', createdAt: '2026-03-14T08:45:00Z', completedAt: null, comments: [] },
  { id: 'tsk_m3n4o5', title: 'Set up TypeScript config and first migration', description: 'tsconfig.json exists but nothing uses it. Pick one util file and migrate as a proof of concept.', status: 'backlog', priority: 'medium', points: 5, assignee: { id: 'usr_001', name: 'Sarah Chen' }, assigneeId: 'usr_001', createdBy: 'usr_001', dueDate: null, createdAt: '2026-02-20T16:00:00Z', comments: [] },
  { id: 'tsk_p6q7r8', title: 'Implement notification bell dropdown', description: 'The bell icon in the header is hardcoded to show 3. Need to wire up to the notifications API and render a dropdown.', status: 'todo', priority: 'medium', points: 5, assignee: { id: 'usr_002', name: 'Alex Rivera' }, assigneeId: 'usr_002', createdBy: 'usr_004', dueDate: '2026-03-28', createdAt: '2026-03-11T10:20:00Z', comments: [] },
  { id: 'tsk_s9t0u1', title: 'Fix KanbanBoard Firefox drag-and-drop', description: 'Drag preview is broken in Firefox. The dataTransfer hack we added only partially works — drop zones flicker.', status: 'in_progress', priority: 'urgent', points: 3, assignee: { id: 'usr_003', name: 'Jordan Lee' }, assigneeId: 'usr_003', createdBy: 'usr_003', dueDate: '2026-03-21', createdAt: '2026-03-16T13:00:00Z', comments: [] },
  { id: 'tsk_v2w3x4', title: 'Add dark mode support to Sidebar', description: 'ThemeContext exists but the sidebar ignores it. Need to add CSS custom properties that respond to data-theme attribute.', status: 'backlog', priority: 'low', points: 2, assignee: null, assigneeId: null, createdBy: 'usr_005', dueDate: null, createdAt: '2026-03-01T09:30:00Z', comments: [] },
  { id: 'tsk_y5z6a7', title: 'Write API documentation for task endpoints', description: 'Sarah keeps asking where the API docs are. They are nowhere. We need to write them.', status: 'done', priority: 'medium', points: 3, assignee: { id: 'usr_004', name: 'Morgan Park' }, assigneeId: 'usr_004', createdBy: 'usr_001', dueDate: '2026-03-15', createdAt: '2026-03-05T15:00:00Z', completedAt: '2026-03-14T17:30:00Z', comments: [] },
  { id: 'tsk_b8c9d0', title: 'Remove dead CSS from KanbanBoard.css', description: 'Half the classes in KanbanBoard.css are unused after the partial Tailwind migration. Clean it up.', status: 'done', priority: 'none', points: 1, assignee: { id: 'usr_005', name: 'Casey Kim' }, assigneeId: 'usr_005', createdBy: 'usr_005', dueDate: '2026-03-18', createdAt: '2026-03-13T12:00:00Z', completedAt: '2026-03-17T10:00:00Z', comments: [] },
];

export function useTasks(projectId, initialFilters) {
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters || {});
  const [pagination, setPagination] = useState({ page: 1, total: 0, perPage: 25 });

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const result = await getTasks(projectId, { ...filters, page: pagination.page });
      const items = result?.items || result?.data || result;
      setTasks(Array.isArray(items) ? items : []);  // API inconsistency
      setPagination(prev => ({ ...prev, total: result?.total || result?.count || 0 }));
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId, filters, pagination.page]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const update = async (taskId, updates) => {
    const updated = await updateTask(taskId, updates);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updated } : t));
    return updated;
  };

  const remove = async (taskId) => {
    await deleteTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return {
    tasks, loading, error, filters, setFilters,
    pagination, setPagination, update, remove,
    refetch: fetchTasks,
  };
}
