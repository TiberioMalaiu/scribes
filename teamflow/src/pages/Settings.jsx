import React, { useState, useContext } from 'react';
import './Settings.css';
import { useAuth } from '../hooks/useAuth';
import { ThemeContext } from '../context/ThemeContext';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    taskUpdated: true,
    mentions: true,
    weeklyDigest: false,
    marketing: false,
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    // TODO: wire up to API
    console.log('Save profile:', { name, email });
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      {/* Profile Section */}
      <section className="settings-section">
        <h2 className="settings-section__title">Profile</h2>
        <div className="settings-section__body">
          <div className="settings-avatar-row">
            <Avatar user={user} size="xl" />
            <button className="settings-avatar-change">Change photo</button>
          </div>

          <div className="settings-field">
            <label className="settings-label">Full Name</label>
            <input
              type="text"
              className="settings-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label className="settings-label">Email</label>
            <input
              type="email"
              className="settings-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button variant="primary" size="sm" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="settings-section">
        <h2 className="settings-section__title">Notifications</h2>
        <div className="settings-section__body">
          {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="settings-checkbox">
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleNotificationChange(key)}
              />
              <span className="settings-checkbox__label">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Theme Section */}
      <section className="settings-section">
        <h2 className="settings-section__title">Appearance</h2>
        <div className="settings-section__body">
          <div className="settings-theme-toggle">
            <span>Theme: {theme}</span>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
          </div>
          <p className="settings-help">
            Dark mode is experimental and may not work with all components.
          </p>
        </div>
      </section>
    </div>
  );
}
