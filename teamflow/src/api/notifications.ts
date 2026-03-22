import client from './client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: string;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  read?: boolean;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
}

export const getNotifications = (params?: NotificationListParams): Promise<NotificationListResponse> =>
  client.get<NotificationListResponse>('/notifications', { params });

export const markAsRead = (id: string): Promise<Notification> =>
  client.patch<Notification>(`/notifications/${id}/read`);

export const markAllAsRead = (): Promise<void> => client.post<void>('/notifications/read-all');

// FIXME: this endpoint sometimes returns 204 No Content
export const deleteNotification = (id: string): Promise<void> =>
  client.delete<void>(`/notifications/${id}`);
