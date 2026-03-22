import client from './client';

export interface TaskCounts {
  backlog: number;
  todo: number;
  in_progress: number;
  in_review: number;
  done: number;
}

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  archived: boolean;
  currentSprintId: string | null;
  members: ProjectMember[];
  taskCounts: TaskCounts;
  updatedAt: string;
}

export interface ProjectListResponse {
  items: Project[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
  archived?: boolean;
}

export interface ProjectMembersResponse {
  items: ProjectMember[];
}

export const getProjects = (): Promise<ProjectListResponse> =>
  client.get<ProjectListResponse>('/projects');

export const getProject = (id: string): Promise<Project> =>
  client.get<Project>(`/projects/${id}`);

export const createProject = (data: CreateProjectData): Promise<Project> =>
  client.post<Project>('/projects', data);

export const updateProject = (id: string, updates: UpdateProjectData): Promise<Project> =>
  client.patch<Project>(`/projects/${id}`, updates);

export const deleteProject = (id: string): Promise<void> =>
  client.delete<void>(`/projects/${id}`);

export const getProjectMembers = (projectId: string): Promise<ProjectMembersResponse> =>
  client.get<ProjectMembersResponse>(`/projects/${projectId}/members`);

export const addProjectMember = (projectId: string, userId: string, role: string): Promise<ProjectMember> =>
  client.post<ProjectMember>(`/projects/${projectId}/members`, { userId, role });

export const removeProjectMember = (projectId: string, userId: string): Promise<void> =>
  client.delete<void>(`/projects/${projectId}/members/${userId}`);
