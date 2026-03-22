import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { ProjectContext } from '../../context/ProjectContext';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

export default function Sidebar() {
  const projectCtx = useContext(ProjectContext);
  const { user, logout } = useAuth();

  const projects = projectCtx?.projects ?? [];
  const currentProject = projectCtx?.currentProject ?? null;
  const selectProject = projectCtx?.selectProject ?? (() => Promise.resolve());

  const navItems: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/tasks', label: 'Tasks', icon: '✅' },
    { to: '/analytics', label: 'Analytics', icon: '📈' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">TF</span>
        <span className="sidebar__app-name">TeamFlow</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            end={item.to === '/'}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__projects">
        <div className="sidebar__section-title">Projects</div>
        {projects.map(project => (
          <button
            key={project.id}
            className={`sidebar__project-btn ${
              currentProject?.id === project.id ? 'sidebar__project-btn--active' : ''
            }`}
            onClick={() => selectProject(project.id)}
          >
            <span className="sidebar__project-dot" style={{
              background: project.color || '#3b82f6'
            }} />
            <span className="sidebar__project-name">{project.name}</span>
          </button>
        ))}
      </div>

      <div className="sidebar__footer">
        {user && (
          <div className="sidebar__user">
            <Avatar user={user} size="sm" />
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-role">{user.role}</span>
            </div>
          </div>
        )}
        <button className="sidebar__logout" onClick={logout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
