import client from './client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  status: string;
  permissions: string[];
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export const login = (email: string, password: string): Promise<LoginResponse> =>
  client.post<LoginResponse>('/auth/login', { email, password });

export const logout = (): Promise<void> => client.post<void>('/auth/logout');

export const refreshToken = (): Promise<RefreshTokenResponse> =>
  client.post<RefreshTokenResponse>('/auth/refresh');

export const forgotPassword = (email: string): Promise<void> =>
  client.post<void>('/auth/forgot-password', { email });

// Returns { user, token, refreshToken } but nobody documented this
export const register = (data: RegisterData): Promise<RegisterResponse> =>
  client.post<RegisterResponse>('/auth/register', data);
