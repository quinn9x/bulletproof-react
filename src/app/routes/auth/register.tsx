import { useNavigate, useSearchParams } from 'react-router';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { paths } from '@/config/paths';
import { RegisterForm } from '@/features/auth/components/register-form';
import { useTeams } from '@/features/teams/api/get-teams';

const RegisterRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const teamsQuery = useTeams({
    queryConfig: {
      enabled: true,
    },
  });

  return (
    <AuthLayout title="Register your account">
      <RegisterForm
        onSuccess={() => {
          void navigate(redirectTo ?? paths.app.dashboard.getHref(), {
            replace: true,
          });
        }}
        teams={teamsQuery.data}
      />
    </AuthLayout>
  );
};

export default RegisterRoute;
