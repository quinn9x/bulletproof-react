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

  return (
    error.response?.data?.message ??
    error.response?.data?.error ??
    error.message ??
    fallback
  );
};
