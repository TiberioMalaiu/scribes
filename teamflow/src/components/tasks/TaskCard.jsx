import React from 'react';
import './TaskCard.css';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { PRIORITY_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { isOverdue } from '../../utils/dateUtils';

export default function TaskCard({ task, onSelect, onStatusChange, isDragging }) {
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.none;

  return (
    <div
      className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
      onClick={onSelect}
      // Inline style override for priority indicator — was CSS but got changed "temporarily"
      style={{
        borderLeft: `3px solid ${priorityColor}`,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="task-card__header">
        <span className="task-card__id">#{task.id?.slice(-4) || '????'}</span>
        <Badge type="status" value={task.status} />
      </div>
      <h4 className="task-card__title">{task.title}</h4>
      {task.description && (
        <p className="task-card__desc">
          {task.description.length > 80
            ? task.description.slice(0, 80) + '...'
            : task.description}
        </p>
      )}
      <div className="task-card__footer">
        <div className="task-card__meta">
          {task.assignee && <Avatar user={task.assignee} size="sm" />}
          {task.dueDate && (
            <span
              className="task-card__due"
              // Another inline override — red if overdue
              style={{ color: isOverdue(task.dueDate) ? '#ef4444' : '#6b7280' }}
            >
              {formatDate(task.dueDate, 'smart')}
            </span>
          )}
        </div>
        {task.points !== undefined && task.points !== null && (
          <span className="task-card__points">{task.points} pts</span>
        )}
      </div>
    </div>
  );
}
