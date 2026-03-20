import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { STATUS_COLORS, TASK_STATUSES } from '../../utils/constants';

export default function StatusPieChart({ tasks, height }) {
  const statusData = TASK_STATUSES.map(status => ({
    name: status.replace(/_/g, ' '),
    value: (tasks || []).filter(t => t.status === status).length,
    color: STATUS_COLORS[status],
  })).filter(d => d.value > 0);

  if (statusData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Task Distribution</h3>
        <p className="text-sm text-gray-400 text-center py-8">No task data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Task Distribution</h3>
      <ResponsiveContainer width="100%" height={height || 280}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} tasks`, name]}
            contentStyle={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-gray-600 capitalize">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
