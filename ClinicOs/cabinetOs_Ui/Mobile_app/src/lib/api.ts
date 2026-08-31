import axios from 'axios';

import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/token-storage';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | string
      | undefined;

    if (typeof data === 'string' && data.length > 0) {
      return data;
    }
    if (data && typeof data === 'object') {
      if (Array.isArray(data.message)) {
        return data.message.join('\n');
      }
      if (typeof data.message === 'string') {
        return data.message;
      }
    }
    return error.message ?? 'Une erreur est survenue';
  }
  return 'Une erreur est survenue';
}
