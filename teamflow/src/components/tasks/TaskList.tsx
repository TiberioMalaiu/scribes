import React from 'react';
import './TaskList.css';
import TaskCard from './TaskCard';
import type { Task, UpdateTaskData } from '../../api/tasks';

interface TaskListProps {
  tasks: Task[] | null;
  onSelectTask: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: UpdateTaskData) => void;
  emptyMessage?: string;
}

export default function TaskList({ tasks, onSelectTask, onUpdateTask, emptyMessage }: TaskListProps) {
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
            onStatusChange={(status: string) => onUpdateTask(task.id, { status })}
          />
        ))}
      </div>
    </div>
  );
}
