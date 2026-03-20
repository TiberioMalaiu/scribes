import React from 'react';
import './TaskList.css';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, onSelectTask, onUpdateTask, emptyMessage }) {
  if (!tasks || tasks.length === 0) {
    return <div className="task-list__empty">{emptyMessage || 'No tasks found'}</div>;
  }

  return (
    <div className="task-list">
      <div className="task-list__header">
        <span className="task-list__count">{tasks.length} tasks</span>
      </div>
      <div className="task-list__items">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={() => onSelectTask(task)}
            onStatusChange={(status) => onUpdateTask(task.id, { status })}
          />
        ))}
      </div>
    </div>
  );
}
