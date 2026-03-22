import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProjectOverview.module.css';
import { getProject, getProjectMembers } from '../api/projects';
import { useTasks } from '../hooks/useTasks';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import TaskList from '../components/tasks/TaskList';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/formatters';

export default function ProjectOverview() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { tasks, loading: tasksLoading } = useTasks(projectId);

  useEffect(() => {
    async function load() {
      try {
        const [proj, mems] = await Promise.all([
          getProject(projectId),
          getProjectMembers(projectId),
        ]);
        setProject(proj);
        setMembers(mems.items || mems || []);
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    }
    if (projectId) load();
  }, [projectId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return <div className={styles.error}>Project not found</div>;
  }

  const tasksByStatus = {
    done: tasks.filter(t => t.status === 'done').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    total: tasks.length,
  };

  return (
    <div className={styles.container}>
      {/* Project header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.projectName}>{project.name}</h1>
          {project.description && (
            <p className={styles.description}>{project.description}</p>
          )}
        </div>
        <div className={styles.memberAvatars}>
          {members.slice(0, 5).map(m => (
            <Avatar key={m.id} user={m} size="md" />
          ))}
          {members.length > 5 && (
            <span className={styles.moreMembers}>+{members.length - 5}</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{tasksByStatus.total}</span>
          <span className={styles.statLabel}>Total Tasks</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{tasksByStatus.in_progress}</span>
          <span className={styles.statLabel}>In Progress</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{tasksByStatus.done}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{members.length}</span>
          <span className={styles.statLabel}>Members</span>
        </div>
      </div>

      {/* Recent tasks */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Tasks</h2>
        {tasksLoading ? (
          <Spinner />
        ) : (
          <TaskList
            tasks={tasks.slice(0, 10)}
            onSelectTask={() => {}}
            onUpdateTask={() => {}}
            emptyMessage="No tasks in this project yet"
          />
        )}
      </div>
    </div>
  );
}
