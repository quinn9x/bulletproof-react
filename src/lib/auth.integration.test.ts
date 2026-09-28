import { describe, expect, it } from 'vite-plus/test';

import type { AuthResponse } from '@/types/api';
import { apiClient } from './api-client';

describe('auth API', () => {
  it('gets the current user', async () => {
    const loginResponse = await apiClient.post<AuthResponse>('/auth/login', {
      email: 'john@example.com',
      password: 'password',
    });

    const user = await apiClient.get('/auth/me', {
      headers: {
        Cookie: `bulletproof_react_app_token=${loginResponse.token}`,
      },
    });

    expect(user).toMatchObject({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'ADMIN',
    });

    expect(user).not.toHaveProperty('password');
  });

  it('logs in with valid credentials', async () => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email: 'john@example.com',
      password: 'password',
    });

    expect(response).toMatchObject({
      user: {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'ADMIN',
      },
      token: expect.any(String),
    });

    expect(response.user).not.toHaveProperty('password');
  });

  it('rejects invalid login credentials', async () => {
    await expect(
      apiClient.post('/auth/login', {
        email: 'john@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Request failed with status code 500');
  });

  it('logs out successfully', async () => {
    const response = await apiClient.post('/auth/logout');

    expect(response).toEqual({
      message: 'Logged out',
    });
  });
});
