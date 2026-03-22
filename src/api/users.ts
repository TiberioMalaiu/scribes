import client from './client';
import { type User } from './auth';

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface UserListResponse {
  items: User[];
  total: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  status?: string;
}

export interface UserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
  emailDigest: boolean;
}

export const getUsers = (params: UserListParams): Promise<UserListResponse> =>
  client.get<UserListResponse>('/users', { params });

export const getUser = (id: string): Promise<User> => client.get<User>(`/users/${id}`);

export const updateUser = (id: string, data: UpdateUserData): Promise<User> =>
  client.patch<User>(`/users/${id}`, data);

export const getUserPreferences = (): Promise<UserPreferences> =>
  client.get<UserPreferences>('/users/me/preferences');

export const updateUserPreferences = (prefs: Partial<UserPreferences>): Promise<UserPreferences> =>
  client.put<UserPreferences>('/users/me/preferences', prefs);
