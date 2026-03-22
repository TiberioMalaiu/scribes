import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login as loginApi, logout as logoutApi, refreshToken } from '../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  status: string;
  permissions: string[];
}

interface LoginResponse {
  user: User;
  token: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// HACK: hardcoded dev user so we can bypass login while there's no backend
const DEV_USER: User = {
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

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(DEV_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await loginApi(email, password) as unknown as LoginResponse;
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    return response;
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes(permission) || user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}
