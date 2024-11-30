/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, setToken, clearToken } from './apiClient';

console.log('process.env', process.env);
// const AUTH_API_URL = `${process.env.AUTH_API_URL}/${process.env.AUTH_API_PREFIX}`;
const AUTH_API_URL = `http://localhost:3011/api/auth/v1`;

export async function registerUser(name: string, email: string, password: string) {
  const response = await apiClient.post<{ token: string; user: any }>(
    `${AUTH_API_URL}/users/register`,
    {
      name,
      email,
      password,
    },
  );
  console.log('response');
  console.log('response', response);
  console.log('response');
  setToken(response.data.token);

  return response.data;
}

export async function loginUser(email: string, password: string) {
  const response = await apiClient.post<{ token: string; user: any }>('/auth/login', {
    email,
    password,
  });

  setToken(response.data.token);
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get<any>('/auth/me');
  return response.data;
}

export function logoutUser() {
  clearToken();
}
