import { configureAuth } from 'react-query-auth';
import { z } from 'zod';

import type { AuthResponse, User } from '@/types/api';
import { apiClient } from './api-client';

const passwordSchema = z
  .string()
  .min(5, 'Password must be at least 5 characters');

export const loginInputSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z.discriminatedUnion('chooseTeam', [
  z.object({
    email: z.email('Please enter a valid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    password: passwordSchema,

    chooseTeam: z.literal(true),
    teamId: z.string().min(1, 'Team ID is required'),
    teamName: z.null(),
  }),

  z.object({
    email: z.email('Please enter a valid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    password: passwordSchema,

    chooseTeam: z.literal(false),
    teamId: z.null(),
    teamName: z.string().min(1, 'Team name is required'),
  }),
]);

export type RegisterInput = z.infer<typeof registerInputSchema>;

const getUser = async (): Promise<User> => {
  const resp = await apiClient.get<User>('/auth/me');

  return resp;
};

const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

const login = async (data: LoginInput): Promise<User> => {
  const resp = await apiClient.post<AuthResponse>('/auth/login', data);

  return resp.user;
};

const register = async (data: RegisterInput): Promise<User> => {
  const resp = await apiClient.post<AuthResponse>('/auth/register', data);

  return resp.user;
};

const authConfig = {
  userFn: getUser,
  logoutFn: logout,
  loginFn: login,
  registerFn: register,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);
