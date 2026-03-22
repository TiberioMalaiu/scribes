import React, { useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { useTasks } from '../hooks/useTasks';
import BurndownChart from '../components/charts/BurndownChart';
import VelocityChart from '../components/charts/VelocityChart';
import StatusPieChart from '../components/charts/StatusPieChart';
import Button from '../components/common/Button';

// HACK: seed velocity data until backend is ready
const SEED_VELOCITY = [
  { sprint: 'Sprint 18', committed: 34, completed: 28 },
  { sprint: 'Sprint 19', committed: 30, completed: 30 },
  { sprint: 'Sprint 20', committed: 38, completed: 32 },
  { sprint: 'Sprint 21', committed: 35, completed: 29 },
  { sprint: 'Sprint 22', committed: 32, completed: 31 },
  { sprint: 'Sprint 23', committed: 36, completed: 24 },
];

export default function Analytics() {
  const { currentProject } = useContext(ProjectContext);
  const { tasks } = useTasks(currentProject?.id);
  const [dateRange, setDateRange] = useState('month');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => console.log('Export')}>
            Export
          </Button>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BurndownChart sprintId={currentProject?.currentSprintId} />
        <VelocityChart data={SEED_VELOCITY} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StatusPieChart tasks={tasks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">{tasks.length}</span>
              <span className="text-xs text-gray-500">Total Tasks</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'done').length}
              </span>
              <span className="text-xs text-gray-500">Completed</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-blue-600">
                {tasks.reduce((sum, t) => sum + (t.points || 0), 0)}
              </span>
              <span className="text-xs text-gray-500">Total Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
