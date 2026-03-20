import React, { useState, useContext } from 'react';
import './Dashboard.css';
import { ProjectContext } from '../context/ProjectContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';

export default function Dashboard() {
  const { currentProject } = useContext(ProjectContext);
  const { tasks, loading } = useTasks(currentProject?.id);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'done';
  });

  const completedThisWeek = tasks.filter(t => {
    if (t.status !== 'done' || !t.completedAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(t.completedAt) > weekAgo;
  });

  const stats = [
    { label: 'Total Tasks', value: tasks.length, color: '#3b82f6' },
    { label: 'Completed This Week', value: completedThisWeek.length, color: '#10b981' },
    { label: 'Overdue', value: overdueTasks.length, color: '#ef4444' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats row — Tailwind layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="dashboard-stat-card">
            <span className="dashboard-stat-card__label">{stat.label}</span>
            <span className="dashboard-stat-card__value" style={{ color: stat.color }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Actions row — Tailwind */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
        <Button variant="primary" size="sm" onClick={() => setShowQuickAdd(true)}>
          + New Task
        </Button>
      </div>

      {/* Recent tasks — uses old CSS card styles */}
      <div className="dashboard-tasks-grid">
        {tasks.slice(0, 6).map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={() => {}}
            onStatusChange={() => {}}
          />
        ))}
      </div>

      {tasks.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">
          No tasks yet. Create one to get started.
        </p>
      )}

      <Modal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        title="New Task"
        size="md"
      >
        <TaskForm
          onSubmit={(data) => {
            console.log('Create task:', data);
            setShowQuickAdd(false);
          }}
          onCancel={() => setShowQuickAdd(false)}
        />
      </Modal>
    </div>
  );
}
