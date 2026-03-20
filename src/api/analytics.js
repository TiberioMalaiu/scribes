import client from './client';

export const getDashboardStats = (projectId, dateRange) =>
  client.get('/analytics/dashboard', { params: { projectId, ...dateRange } });

export const getVelocityData = (projectId, sprintCount) =>
  client.get('/analytics/velocity', { params: { projectId, sprintCount: sprintCount || 6 } });

export const getBurndownData = (sprintId) =>
  client.get(`/analytics/burndown/${sprintId}`);

// Returns raw CSV string, not JSON — one-off inconsistency
export const exportReport = (projectId, format) =>
  client.get(`/analytics/export/${projectId}`, {
    params: { format: format || 'csv' },
    responseType: 'blob',
  });
