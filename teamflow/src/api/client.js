import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Interceptor adds auth but return type is unknown
client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — swallows error shape, returns data directly
// This means every api call returns response.data, not AxiosResponse
client.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Error shape is lost here
    return Promise.reject(error.response?.data || error);
  }
);

export default client;
