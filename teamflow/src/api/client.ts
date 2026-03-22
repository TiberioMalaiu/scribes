import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

/**
 * The response interceptor unwraps AxiosResponse and returns `response.data`
 * directly. This means every call through `client` resolves to `T` rather than
 * `AxiosResponse<T>`. We expose a narrower interface so callers get the
 * correct return type without casting.
 */
export interface ApiClient {
  get<T = unknown>(url: string, config?: Parameters<AxiosInstance['get']>[1]): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: Parameters<AxiosInstance['post']>[2]): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: Parameters<AxiosInstance['put']>[2]): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: Parameters<AxiosInstance['patch']>[2]): Promise<T>;
  delete<T = unknown>(url: string, config?: Parameters<AxiosInstance['delete']>[1]): Promise<T>;
}

export interface ApiErrorData {
  message?: string;
  code?: string;
  [key: string]: unknown;
}

const instance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Interceptor adds auth but return type is unknown
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — swallows error shape, returns data directly
// This means every api call returns response.data, not AxiosResponse
instance.interceptors.response.use(
  (response: AxiosResponse) => response.data as unknown as AxiosResponse,
  (error: unknown) => {
    const axiosError = error as { response?: AxiosResponse<ApiErrorData> };
    if (axiosError.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Error shape is lost here
    return Promise.reject(axiosError.response?.data || error);
  }
);

const client: ApiClient = instance as unknown as ApiClient;

export default client;
