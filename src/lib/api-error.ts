import axios from 'axios';

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallback;
  }

  if (!error.response) {
    return 'Unable to connect to the server. Please check your connection and try again.';
  }

  return error.response.data?.message ?? error.response.data?.error ?? fallback;
};
