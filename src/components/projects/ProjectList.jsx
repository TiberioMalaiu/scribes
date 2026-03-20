import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { useDebounce } from '../../hooks/useDebounce';

export default function ProjectList({ projects, onSelectProject }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filtered = projects.filter(p =>
    p.name?.toLowerCase().includes((debouncedSearch || '').toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No projects found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onSelectProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
