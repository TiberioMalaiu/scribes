import React from 'react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';

type BadgeType = 'status' | 'priority';

interface BadgeProps {
  type: BadgeType;
  value?: string;
  label?: string;
}

const typeConfig: Record<BadgeType, Record<string, string>> = {
  status: STATUS_COLORS,
  priority: PRIORITY_COLORS,
};

export default function Badge({ type, value, label }: BadgeProps) {
  const colors = typeConfig[type] || {};
  const bgColor = (value ? colors[value] : undefined) || '#d1d5db';

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: bgColor + '20', color: bgColor }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: bgColor }}
      />
      {label || value?.replace(/_/g, ' ')}
    </span>
  );
}
