import client from './client';

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeMembers: number;
  velocity: number;
}

export interface VelocityDataPoint {
  sprint: string;
  committed: number;
  completed: number;
}

export interface BurndownDataPoint {
  date: string;
  ideal: number;
  actual: number | null;
}

export interface BurndownResponse {
  points?: BurndownDataPoint[];
}

export const getDashboardStats = (projectId: string, dateRange: DateRange): Promise<DashboardStats> =>
  client.get<DashboardStats>('/analytics/dashboard', { params: { projectId, ...dateRange } });

export const getVelocityData = (projectId: string, sprintCount?: number): Promise<VelocityDataPoint[]> =>
  client.get<VelocityDataPoint[]>('/analytics/velocity', { params: { projectId, sprintCount: sprintCount || 6 } });

export const getBurndownData = (sprintId: string): Promise<BurndownResponse> =>
  client.get<BurndownResponse>(`/analytics/burndown/${sprintId}`);

// Returns raw CSV string, not JSON — one-off inconsistency
export const exportReport = (projectId: string, format?: string): Promise<Blob> =>
  client.get<Blob>(`/analytics/export/${projectId}`, {
    params: { format: format || 'csv' },
    responseType: 'blob',
  });
