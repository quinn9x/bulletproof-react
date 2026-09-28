import { Outlet, useRouteError } from 'react-router';

import { MainErrorFallback } from '@/components/errors/main';
import { DashboardLayout } from '@/components/layouts';

export const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <MainErrorFallback
      error={error}
      resetErrorBoundary={() => window.location.reload()}
    />
  );
};

const AppRoot = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
