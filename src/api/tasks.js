import client from './client';

// No return types, no input types — pure trust
export const getTasks = (projectId, filters) => {
  const params = { projectId, ...filters };
  return client.get('/tasks', { params });
};

export const getTask = (id) => client.get(`/tasks/${id}`);

export const createTask = (data) => client.post('/tasks', data);

export const updateTask = (id, updates) => client.patch(`/tasks/${id}`, updates);

export const deleteTask = (id) => client.delete(`/tasks/${id}`);

export const bulkUpdateTasks = (ids, updates) =>
  client.post('/tasks/bulk', { ids, updates });

// Returns a different shape than getTasks — inconsistency is intentional
export const searchTasks = (query) =>
  client.get('/tasks/search', { params: { q: query } });
