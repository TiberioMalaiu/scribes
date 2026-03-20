import React, { useState } from 'react';
import './Header.css';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';
import Breadcrumbs from './Breadcrumbs';
import { useAuth } from '../../hooks/useAuth';
import { useDebounce } from '../../hooks/useDebounce';

export default function Header() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);  // Hardcoded for now
  const debouncedQuery = useDebounce(searchQuery, 400);

  const userMenuOptions = [
    { label: 'Profile', value: 'profile', icon: '👤' },
    { label: 'Settings', value: 'settings', icon: '⚙️' },
    { divider: true },
    { label: 'Log out', value: 'logout', icon: '🚪', danger: true },
  ];

  const handleUserMenuSelect = (option) => {
    if (option.value === 'logout') {
      // TODO: call logout
      console.log('logout');
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <Breadcrumbs />
      </div>

      <div className="header__center">
        {/* Search — newer addition, uses Tailwind */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-64 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        </div>
      </div>

      <div className="header__right">
        {/* Notification bell — old CSS style */}
        <button className="header__notification-btn">
          🔔
          {notificationCount > 0 && (
            <span className="header__notification-badge">{notificationCount}</span>
          )}
        </button>

        <Dropdown
          trigger={<Avatar user={user} size="md" />}
          options={userMenuOptions}
          onSelect={handleUserMenuSelect}
          align="right"
        />
      </div>
    </header>
  );
}
