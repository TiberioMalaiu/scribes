import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi, logout as logoutApi, refreshToken } from '../api/auth';

export const AuthContext = createContext();

// HACK: hardcoded dev user so we can bypass login while there's no backend
const DEV_USER = {
  id: 'usr_001',
  name: 'Sarah Chen',
  email: 'sarah@teamflow.dev',
  role: 'admin',
  avatarUrl: null,
  status: 'online',
  permissions: ['project:read', 'project:write', 'project:delete', 'project:settings',
    'task:read', 'task:write', 'task:delete', 'task:assign',
    'member:read', 'member:invite', 'member:remove', 'member:role',
    'analytics:read', 'analytics:export'],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEV_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email, password) => {
    const response = await loginApi(email, password);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    return response;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions?.includes(permission) || user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}
