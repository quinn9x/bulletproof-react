import Axios, { type AxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { paths } from '@/config/paths';

export const api = Axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

let isRedirectingToLogin = false;

function redirectToLogin() {
  if (isRedirectingToLogin) return;

  isRedirectingToLogin = true;

  const redirectTo = window.location.pathname + window.location.search;

  window.location.href = paths.auth.login.getHref(redirectTo);
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};
