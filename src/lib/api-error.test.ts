import { type AxiosError } from 'axios';
import { describe, expect, it } from 'vite-plus/test';

import { getApiErrorMessage } from './api-error';

const createAxiosError = (data?: {
  message?: string;
  error?: string;
}): AxiosError => {
  return {
    isAxiosError: true,
    message: 'Request failed',
    name: 'AxiosError',
    config: {},
    toJSON: () => ({}),
    response: data
      ? {
          data,
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {},
        }
      : undefined,
  } as AxiosError;
};

describe('getApiErrorMessage', () => {
  it('returns API message', () => {
    expect(
      getApiErrorMessage(createAxiosError({ message: 'Title is required' })),
    ).toBe('Title is required');
  });

  it('returns API error', () => {
    expect(getApiErrorMessage(createAxiosError({ error: 'Bad Request' }))).toBe(
      'Bad Request',
    );
  });

  it('returns fallback when API response has no message', () => {
    expect(getApiErrorMessage(createAxiosError({}))).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('returns network error message when response is unavailable', () => {
    expect(getApiErrorMessage(createAxiosError())).toBe(
      'Unable to connect to the server. Please check your connection and try again.',
    );
  });

  it('returns fallback for non-Axios errors', () => {
    expect(getApiErrorMessage(new Error('Unexpected error'))).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('supports a custom fallback', () => {
    expect(
      getApiErrorMessage(new Error('Unexpected error'), 'Custom error'),
    ).toBe('Custom error');
  });
});
