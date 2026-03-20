import client from './client';

export const login = (email, password) =>
  client.post('/auth/login', { email, password });

export const logout = () => client.post('/auth/logout');

export const refreshToken = () => client.post('/auth/refresh');

export const forgotPassword = (email) =>
  client.post('/auth/forgot-password', { email });

// Returns { user, token, refreshToken } but nobody documented this
export const register = (data) => client.post('/auth/register', data);
