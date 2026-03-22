import client from './client';

export const getNotifications = (params) => client.get('/notifications', { params });

export const markAsRead = (id) => client.patch(`/notifications/${id}/read`);

export const markAllAsRead = () => client.post('/notifications/read-all');

// FIXME: this endpoint sometimes returns 204 No Content
export const deleteNotification = (id) => client.delete(`/notifications/${id}`);
