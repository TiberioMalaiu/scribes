import React, { useState, useEffect, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { useTasks } from '../hooks/useTasks';
import { getVelocityData } from '../api/analytics';
import BurndownChart from '../components/charts/BurndownChart';
import VelocityChart from '../components/charts/VelocityChart';
import StatusPieChart from '../components/charts/StatusPieChart';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

export default function Analytics() {
  const { currentProject } = useContext(ProjectContext);
  const { tasks } = useTasks(currentProject?.id);
  const [dateRange, setDateRange] = useState('month');
  const [velocityData, setVelocityData] = useState([]);
  const [velocityLoading, setVelocityLoading] = useState(false);

  useEffect(() => {
    async function loadVelocity() {
      if (!currentProject?.id) return;
      setVelocityLoading(true);
      try {
        const data = await getVelocityData(currentProject.id, 6);
        setVelocityData(data.sprints || data || []);
      } catch (err) {
        console.error('Failed to load velocity:', err);
      } finally {
        setVelocityLoading(false);
      }
    }
    loadVelocity();
  }, [currentProject?.id]);

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
        {velocityLoading ? (
          <div className="flex items-center justify-center bg-white rounded-lg border border-gray-200 p-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <VelocityChart data={velocityData} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusPieChart tasks={tasks} />
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4">
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
