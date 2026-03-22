import client from './client';

export const getProjects = () => client.get('/projects');

export const getProject = (id) => client.get(`/projects/${id}`);

export const createProject = (data) => client.post('/projects', data);

export const updateProject = (id, updates) => client.patch(`/projects/${id}`, updates);

export const deleteProject = (id) => client.delete(`/projects/${id}`);

export const getProjectMembers = (projectId) => client.get(`/projects/${projectId}/members`);

export const addProjectMember = (projectId, userId, role) =>
  client.post(`/projects/${projectId}/members`, { userId, role });

export const removeProjectMember = (projectId, userId) =>
  client.delete(`/projects/${projectId}/members/${userId}`);
