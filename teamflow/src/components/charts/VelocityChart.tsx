import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { VelocityDataPoint } from '../../api/analytics';

interface VelocityChartProps {
  data: VelocityDataPoint[] | null;
  height?: number;
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  background: '#fff',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const titleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#111827',
  marginBottom: '16px',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#9ca3af',
  padding: '40px 0',
  fontSize: '14px',
};

export default function VelocityChart({ data, height }: VelocityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>Team Velocity</h3>
        <p style={emptyStyle}>No velocity data available</p>
      </div>
    );
  }

  const avgVelocity = data.reduce((sum, d) => sum + (d.completed || 0), 0) / data.length;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={titleStyle}>Team Velocity</h3>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          Avg: {avgVelocity.toFixed(1)} pts/sprint
        </span>
      </div>
      <ResponsiveContainer width="100%" height={height || 300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="sprint"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar
            dataKey="committed"
            fill="#e5e7eb"
            radius={[4, 4, 0, 0]}
            name="Committed"
          />
          <Bar
            dataKey="completed"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            name="Completed"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
