import React from 'react';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants';

interface TaskFiltersState {
  status?: string;
  priority?: string;
  search?: string;
  [key: string]: string | undefined;
}

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onFilterChange: (filters: TaskFiltersState) => void;
}

export default function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const handleChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasFilters = Object.values(filters || {}).some(v => v && v !== 'all');

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={filters?.status || 'all'}
        onChange={(e) => handleChange('status', e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
      >
        <option value="all">All statuses</option>
        {TASK_STATUSES.map(s => (
          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
        ))}
      </select>

      <select
        value={filters?.priority || 'all'}
        onChange={(e) => handleChange('priority', e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
      >
        <option value="all">All priorities</option>
        {TASK_PRIORITIES.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <input
        type="text"
        value={filters?.search || ''}
        onChange={(e) => handleChange('search', e.target.value)}
        placeholder="Search tasks..."
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-48"
      />

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
