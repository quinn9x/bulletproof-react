import { describe, expect, it } from 'vite-plus/test';

import { apiClient } from '@/lib/api-client';
import type { AuthResponse, Discussion } from '@/types/api';

const login = async () => {
  const response = await apiClient.post<AuthResponse>('/auth/login', {
    email: 'john@example.com',
    password: 'password',
  });

  return response.token;
};

describe('discussions API', () => {
  it('gets discussions for the authenticated user', async () => {
    const token = await login();

    const response = await apiClient.get<{
      data: Discussion[];
      meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
      };
    }>('/discussions', {
      headers: {
        Cookie: `bulletproof_react_app_token=${token}`,
      },
    });

    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Welcome',
          body: 'Welcome to the team!',
        }),
      ]),
    );

    expect(response.meta).toMatchObject({
      page: 1,
      pageSize: 10,
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  it('gets a discussion by ID', async () => {
    const token = await login();

    const list = await apiClient.get<{ data: Discussion[] }>('/discussions', {
      headers: {
        Cookie: `bulletproof_react_app_token=${token}`,
      },
    });

    const discussion = list.data[0];

    const response = await apiClient.get<Discussion>(
      `/discussions/${discussion.id}`,
      {
        headers: {
          Cookie: `bulletproof_react_app_token=${token}`,
        },
      },
    );

    expect(response).toMatchObject({
      id: discussion.id,
      title: discussion.title,
      body: discussion.body,
    });

    expect(response.author).toMatchObject({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('creates a discussion', async () => {
    const token = await login();

    const response = await apiClient.post<Discussion>(
      '/discussions',
      {
        title: 'Test discussion',
        body: 'Discussion created by integration test.',
      },
      {
        headers: {
          Cookie: `bulletproof_react_app_token=${token}`,
        },
      },
    );

    expect(response).toMatchObject({
      title: 'Test discussion',
      body: 'Discussion created by integration test.',
    });

    expect(response.id).toEqual(expect.any(String));
    expect(response.teamId).toEqual(expect.any(String));
  });

  it('updates a discussion', async () => {
    const token = await login();

    const created = await apiClient.post<Discussion>(
      '/discussions',
      {
        title: 'Discussion before update',
        body: 'Original body.',
      },
      {
        headers: {
          Cookie: `bulletproof_react_app_token=${token}`,
        },
      },
    );

    const response = await apiClient.patch<Discussion>(
      `/discussions/${created.id}`,
      {
        title: 'Discussion after update',
        body: 'Updated body.',
      },
      {
        headers: {
          Cookie: `bulletproof_react_app_token=${token}`,
        },
      },
    );

    expect(response).toMatchObject({
      id: created.id,
      title: 'Discussion after update',
      body: 'Updated body.',
    });
  });

  it('deletes a discussion', async () => {
    const token = await login();

    const created = await apiClient.post<Discussion>(
      '/discussions',
      {
        title: 'Discussion to delete',
        body: 'This discussion will be deleted.',
      },
      {
        headers: {
          Cookie: `bulletproof_react_app_token=${token}`,
        },
      },
    );

    const response = await apiClient.delete(`/discussions/${created.id}`, {
      headers: {
        Cookie: `bulletproof_react_app_token=${token}`,
      },
    });

    expect(response).toBe('');

    await expect(
      apiClient.get(`/discussions/${created.id}`, {
        headers: {
          Cookie: `bulletproof_react_app_token=${token}`,
        },
      }),
    ).rejects.toThrow('Request failed with status code 404');
  });

  it('rejects unauthenticated requests', async () => {
    await expect(
      apiClient.get('/discussions', {
        headers: {
          Cookie: 'bulletproof_react_app_token=invalid-token',
        },
      }),
    ).rejects.toThrow('Request failed with status code 401');
  });
});
