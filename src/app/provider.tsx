import { Suspense, useState, type ReactNode } from 'react';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { Spinner } from '@/components/ui/spinner';
import { toast, Toaster } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/api-error';
import { AuthLoader } from '@/lib/auth';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,

        queryCache: new QueryCache({
          onError: (error) => {
            console.error('Query error:', error);

            toast.add({
              title: 'Unable to load data',
              description: getApiErrorMessage(error),
              type: 'error',
            });
          },
        }),

        mutationCache: new MutationCache({
          onError: (error) => {
            console.error('Mutation error:', error);

            toast.add({
              title: 'Something went wrong',
              description: getApiErrorMessage(error),
              type: 'error',
            });
          },
        }),
      }),
  );

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner className="size-8" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {import.meta.env.DEV && <ReactQueryDevtools />}
          <Toaster />
          <AuthLoader
            renderLoading={() => (
              <div className="flex h-screen w-screen items-center justify-center">
                <Spinner className="size-10" />
              </div>
            )}
          >
            {children}
          </AuthLoader>
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
