import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * Custom client interface reflecting the response interceptor behavior.
 * The interceptor returns response.data directly, so methods resolve
 * with T instead of AxiosResponse<T>.
 */
export interface ApiClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Interceptor adds auth but return type is unknown
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — swallows error shape, returns data directly
// This means every api call returns response.data, not AxiosResponse
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Error shape is lost here
    return Promise.reject(error.response?.data || error);
  }
);

const client = axiosInstance as unknown as ApiClient;

export default client;
