import React, { useState } from 'react';
import './KanbanBoard.css';
import TaskCard from './TaskCard';
import type { Task, UpdateTaskData } from '../../api/tasks';

interface KanbanColumn {
  id: string;
  name: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: UpdateTaskData) => void;
  columns: KanbanColumn[];
}

export default function KanbanBoard({ tasks, onUpdateTask, columns }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [localColumns, setLocalColumns] = useState<KanbanColumn[]>(columns || []);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const handleDragStart = (task: Task, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    // HACK: Firefox requires data to be set
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDrop = (columnId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedTask) return;

    // BUG-PRONE: no validation on columnId or task shape
    onUpdateTask(draggedTask.id, { status: columnId });
    setDraggedTask(null);
    setDropTarget(null);
  };

  const getTasksForColumn = (colId: string): Task[] => {
    return tasks.filter(t => t.status === colId);
  };

  // Intentionally loose — tasks could be anything
  const totalPoints = tasks.reduce((sum, t) => sum + (t.points || 0), 0);

  return (
    // New Tailwind wrapper, old CSS inside
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
      {localColumns.map(col => (
        <div
          key={col.id}
          className={`kanban-column ${dropTarget === col.id ? 'kanban-column--drop-active' : ''}`}
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDropTarget(col.id); }}
          onDragLeave={() => setDropTarget(null)}
          onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(col.id, e)}
        >
          {/* New Tailwind header, old CSS body */}
          <div className="flex items-center justify-between px-2 py-3 mb-2">
            <h3 className="text-sm font-semibold text-gray-700">{col.name}</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {getTasksForColumn(col.id).length}
            </span>
          </div>
          <div className="kanban-column__body">
            {getTasksForColumn(col.id).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(task, e)}
              >
                <TaskCard
                  task={task}
                  onSelect={() => {}}
                  isDragging={draggedTask?.id === task.id}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
