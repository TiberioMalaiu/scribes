import React from 'react';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/formatters';

export default function ProjectCard({ project, onClick }) {
  const completedTasks = project.taskCounts?.done || 0;
  const totalTasks = Object.values(project.taskCounts || {}).reduce((a, b) => a + b, 0);
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 truncate">{project.name}</h3>
        {project.archived && (
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Archived</span>
        )}
      </div>

      {project.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>{completedTasks} of {totalTasks} tasks</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {(project.members || []).slice(0, 4).map((member, i) => (
            <Avatar key={member.id || i} user={member} size="sm" />
          ))}
          {(project.members?.length || 0) > 4 && (
            <span className="w-6 h-6 rounded-full bg-gray-100 text-xs flex items-center justify-center text-gray-500 ring-2 ring-white">
              +{project.members.length - 4}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {project.updatedAt ? formatDate(project.updatedAt, 'relative') : ''}
        </span>
      </div>
    </div>
  );
}
