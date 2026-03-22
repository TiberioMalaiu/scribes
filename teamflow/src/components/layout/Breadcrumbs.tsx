import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const routeNames: Record<string, string> = {
  '': 'Dashboard',
  'tasks': 'Tasks',
  'projects': 'Projects',
  'settings': 'Settings',
  'analytics': 'Analytics',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return <span className="text-sm font-medium text-gray-900">Dashboard</span>;
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link to="/" className="text-gray-500 hover:text-gray-700">
        Dashboard
      </Link>
      {segments.map((segment, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const isLast = i === segments.length - 1;
        const label = routeNames[segment] || segment;

        return (
          <React.Fragment key={path}>
            <span className="text-gray-300">/</span>
            {isLast ? (
              <span className="font-medium text-gray-900">{label}</span>
            ) : (
              <Link to={path} className="text-gray-500 hover:text-gray-700">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
