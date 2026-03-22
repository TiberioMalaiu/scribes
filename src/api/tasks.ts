import client from './client';

export interface TaskAssignee {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  points: number;
  assignee: TaskAssignee | null;
  assigneeId: string | null;
  createdBy: string;
  dueDate: string | null;
  createdAt: string;
  completedAt?: string | null;
  comments: unknown[];
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  assigneeId?: string;
  page?: number;
}

export interface TaskListResponse {
  items: Task[];
  data?: Task[];
  total?: number;
  count?: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  points?: number;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  points?: number;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface SearchTasksResponse {
  results: Task[];
  total: number;
}

// No return types, no input types — pure trust
export const getTasks = (projectId: string, filters?: TaskFilters): Promise<TaskListResponse> => {
  const params = { projectId, ...filters };
  return client.get<TaskListResponse>('/tasks', { params });
};

export const getTask = (id: string): Promise<Task> => client.get<Task>(`/tasks/${id}`);

export const createTask = (data: CreateTaskData): Promise<Task> => client.post<Task>('/tasks', data);

export const updateTask = (id: string, updates: UpdateTaskData): Promise<Task> =>
  client.patch<Task>(`/tasks/${id}`, updates);

export const deleteTask = (id: string): Promise<void> => client.delete<void>(`/tasks/${id}`);

export const bulkUpdateTasks = (ids: string[], updates: UpdateTaskData): Promise<Task[]> =>
  client.post<Task[]>('/tasks/bulk', { ids, updates });

// Returns a different shape than getTasks — inconsistency is intentional
export const searchTasks = (query: string): Promise<SearchTasksResponse> =>
  client.get<SearchTasksResponse>('/tasks/search', { params: { q: query } });
