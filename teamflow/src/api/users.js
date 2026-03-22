import client from './client';

export const getUsers = (params) => client.get('/users', { params });

export const getUser = (id) => client.get(`/users/${id}`);

export const updateUser = (id, data) => client.patch(`/users/${id}`, data);

export const getUserPreferences = () => client.get('/users/me/preferences');

export const updateUserPreferences = (prefs) => client.put('/users/me/preferences', prefs);
