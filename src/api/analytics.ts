import client from './client';

export interface DateRange {
  start?: string;
  end?: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
}

export interface SprintVelocity {
  sprintId: string;
  name: string;
  planned: number;
  completed: number;
}

export interface VelocityResponse {
  sprints: SprintVelocity[];
}

export interface BurndownPoint {
  date: string;
  ideal: number;
  actual: number;
}

export interface BurndownResponse {
  points: BurndownPoint[];
}

export const getDashboardStats = (projectId: string, dateRange: DateRange): Promise<DashboardStats> =>
  client.get<DashboardStats>('/analytics/dashboard', { params: { projectId, ...dateRange } });

export const getVelocityData = (projectId: string, sprintCount?: number): Promise<VelocityResponse> =>
  client.get<VelocityResponse>('/analytics/velocity', { params: { projectId, sprintCount: sprintCount || 6 } });

export const getBurndownData = (sprintId: string): Promise<BurndownResponse> =>
  client.get<BurndownResponse>(`/analytics/burndown/${sprintId}`);

// Returns raw CSV string, not JSON — one-off inconsistency
export const exportReport = (projectId: string, format?: string): Promise<Blob> =>
  client.get<Blob>(`/analytics/export/${projectId}`, {
    params: { format: format || 'csv' },
    responseType: 'blob',
  });
