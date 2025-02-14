import axios from 'axios';
import { handleError } from '@/lib/error';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const handledError = handleError(error);
    return Promise.reject({
      ...handledError,
      timestamp: new Date().toISOString(),
      path: error.config?.url
    });
  }
); 