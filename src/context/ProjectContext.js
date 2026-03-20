import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getProjects, getProject } from '../api/projects';

export const ProjectContext = createContext();

// HACK: seed data until we have a real backend
const SEED_PROJECTS = [
  { id: 'proj_001', name: 'Mobile App v2', description: 'React Native rewrite of the mobile client', color: '#3b82f6', archived: false, currentSprintId: 'spr_010',
    members: [{ id: 'usr_001', name: 'Sarah Chen', role: 'owner' }, { id: 'usr_002', name: 'Alex Rivera', role: 'admin' }, { id: 'usr_003', name: 'Jordan Lee', role: 'member' }],
    taskCounts: { backlog: 12, todo: 8, in_progress: 5, in_review: 3, done: 24 }, updatedAt: '2026-03-18T14:30:00Z' },
  { id: 'proj_002', name: 'API Platform', description: 'Backend services and infrastructure', color: '#10b981', archived: false, currentSprintId: 'spr_020',
    members: [{ id: 'usr_001', name: 'Sarah Chen', role: 'admin' }, { id: 'usr_004', name: 'Morgan Park', role: 'owner' }],
    taskCounts: { backlog: 6, todo: 4, in_progress: 3, in_review: 1, done: 18 }, updatedAt: '2026-03-19T09:15:00Z' },
  { id: 'proj_003', name: 'Design System', description: 'Shared component library and tokens', color: '#f59e0b', archived: false, currentSprintId: null,
    members: [{ id: 'usr_005', name: 'Casey Kim', role: 'owner' }, { id: 'usr_001', name: 'Sarah Chen', role: 'member' }],
    taskCounts: { backlog: 3, todo: 2, in_progress: 1, in_review: 0, done: 9 }, updatedAt: '2026-03-15T11:00:00Z' },
];

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [currentProject, setCurrentProject] = useState(SEED_PROJECTS[0]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      const items = data?.items || data;
      setProjects(Array.isArray(items) ? items : []);  // API inconsistency
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectProject = useCallback(async (projectId) => {
    if (!projectId) {
      setCurrentProject(null);
      return;
    }
    try {
      const project = await getProject(projectId);
      setCurrentProject(project);
      localStorage.setItem('lastProject', projectId);
    } catch (err) {
      console.error('Failed to load project:', err);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Auto-select last project
  useEffect(() => {
    if (projects.length && !currentProject) {
      const lastId = localStorage.getItem('lastProject');
      const target = lastId && projects.find(p => p.id === lastId);
      if (target) selectProject(target.id);
    }
  }, [projects, currentProject, selectProject]);

  return (
    <ProjectContext.Provider value={{
      projects, currentProject, loading,
      fetchProjects, selectProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
}
