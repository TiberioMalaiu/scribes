import React, { useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/tasks/TaskList';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskDetail from '../components/tasks/TaskDetail';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { TASK_STATUSES } from '../utils/constants';
import type { Task, UpdateTaskData } from '../api/tasks';

interface KanbanColumn {
  id: string;
  name: string;
}

type ViewMode = 'list' | 'board';

const KANBAN_COLUMNS: KanbanColumn[] = TASK_STATUSES.map(s => ({
  id: s,
  name: s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
}));

export default function TaskBoard(): React.ReactElement {
  const { currentProject } = useContext(ProjectContext)!;
  const { tasks, loading, filters, setFilters, update, remove } = useTasks(currentProject?.id);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'board'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Board
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <TaskFilters filters={filters as Record<string, string | undefined>} onFilterChange={setFilters} />
      </div>

      {/* Content */}
      <div className="flex flex-1 gap-4">
        <div className="flex-1">
          {tasks.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No tasks yet"
              description="Create your first task to start tracking work"
              action={<Button variant="primary">Create Task</Button>}
            />
          ) : viewMode === 'list' ? (
            <TaskList
              tasks={tasks}
              onSelectTask={setSelectedTask}
              onUpdateTask={(id: string, updates: UpdateTaskData) => update(id, updates)}
            />
          ) : (
            <KanbanBoard
              tasks={tasks}
              onUpdateTask={(id: string, updates: UpdateTaskData) => update(id, updates)}
              columns={KANBAN_COLUMNS}
            />
          )}
        </div>

        {/* Detail panel */}
        {selectedTask && (
          <div className="w-96 flex-shrink-0">
            <TaskDetail
              task={selectedTask}
              onUpdate={(id: string, updates: UpdateTaskData) => update(id, updates)}
              onDelete={(id: string) => { remove(id); setSelectedTask(null); }}
              onClose={() => setSelectedTask(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
