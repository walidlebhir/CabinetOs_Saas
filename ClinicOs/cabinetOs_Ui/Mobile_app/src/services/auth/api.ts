import { api } from '@/lib/api';
import type { LoginPayload, LoginResponse, RegisterPayload } from './types';

export async function loginRequest(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/authentification/login',
    payload
  );
  return response.data;
}

export async function registerRequest(
  payload: RegisterPayload
): Promise<string> {
  const response = await api.post<string>(
    '/authentification/register',
    payload,
    { responseType: 'text' }
  );
  return typeof response.data === 'string'
    ? response.data
    : String(response.data);
}
