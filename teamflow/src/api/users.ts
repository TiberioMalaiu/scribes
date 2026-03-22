import client from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  status: string;
  permissions: string[];
}

export interface UserListParams {
  page?: number;
  perPage?: number;
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
  role?: string;
  avatarUrl?: string | null;
}

export interface UserPreferences {
  theme?: string;
  notifications?: boolean;
  language?: string;
  [key: string]: unknown;
}

export const getUsers = (params?: UserListParams): Promise<UserListResponse> =>
  client.get<UserListResponse>('/users', { params });

export const getUser = (id: string): Promise<User> =>
  client.get<User>(`/users/${id}`);

export const updateUser = (id: string, data: UpdateUserData): Promise<User> =>
  client.patch<User>(`/users/${id}`, data);

export const getUserPreferences = (): Promise<UserPreferences> =>
  client.get<UserPreferences>('/users/me/preferences');

export const updateUserPreferences = (prefs: UserPreferences): Promise<UserPreferences> =>
  client.put<UserPreferences>('/users/me/preferences', prefs);
