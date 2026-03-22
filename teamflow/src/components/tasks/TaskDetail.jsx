import React, { useState } from 'react';
import styles from './TaskDetail.module.css';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import TaskComments from './TaskComments';
import { formatDate } from '../../utils/formatters';
import { canEditTask, canDeleteTask } from '../../utils/permissions';
import { useAuth } from '../../hooks/useAuth';

// TODO: migrate to TypeScript
export default function TaskDetail({ task, onUpdate, onDelete, onClose }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [editDescription, setEditDescription] = useState(task?.description || '');

  if (!task) return null;

  const handleSave = () => {
    onUpdate(task.id, { title: editTitle, description: editDescription });
    setIsEditing(false);
  };

  const canEdit = canEditTask(user, task);
  const canDelete = canDeleteTask(user, task);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.taskId}>#{task.id?.slice(-4)}</span>
          <Badge type="status" value={task.status} />
          <Badge type="priority" value={task.priority} />
        </div>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
      </div>

      <div className={styles.body}>
        {isEditing ? (
          <div className={styles.editForm}>
            <input
              className={styles.editTitle}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title"
            />
            <textarea
              className={styles.editDesc}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description..."
              rows={4}
            />
            <div className={styles.editActions}>
              <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>{task.title}</h2>
            <p className={styles.description}>{task.description || 'No description'}</p>
            {canEdit && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </>
        )}

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Assignee</span>
            {task.assignee ? (
              <div className={styles.assignee}>
                <Avatar user={task.assignee} size="sm" />
                <span>{task.assignee.name}</span>
              </div>
            ) : (
              <span className={styles.unassigned}>Unassigned</span>
            )}
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Due date</span>
            <span>{task.dueDate ? formatDate(task.dueDate, 'smart') : 'No due date'}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Points</span>
            <span>{task.points ?? '-'}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Created</span>
            <span>{task.createdAt ? formatDate(task.createdAt, 'relative') : 'Unknown'}</span>
          </div>
        </div>

        <TaskComments taskId={task.id} comments={task.comments || []} />
      </div>

      {canDelete && (
        <div className={styles.footer}>
          <Button variant="danger" size="sm" onClick={() => onDelete(task.id)}>
            Delete Task
          </Button>
        </div>
      )}
    </div>
  );
}
