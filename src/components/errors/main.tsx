import type { FallbackProps } from 'react-error-boundary';

import { getApiErrorMessage } from '@/lib/api-error';
import { Button } from '../ui/button';

export const MainErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  const message = getApiErrorMessage(error);

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :(</h2>
      <p>{message}</p>

      <Button className="mt-4" onClick={resetErrorBoundary}>
        Refresh
      </Button>
    </div>
  );
};
