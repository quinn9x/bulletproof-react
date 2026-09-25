import { useEffect, type ReactNode } from 'react';

import { useNavigate, useSearchParams } from 'react-router';

import logo from '@/assets/react.svg';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';
import { Head } from '../seo';
import { Card, CardContent } from '../ui/card';
import { Link } from '../ui/link';

type LayoutProps = {
  children: ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const user = useUser();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      void navigate(redirectTo ?? paths.app.dashboard.getHref(), {
        replace: true,
      });
    }
  }, [user.data, navigate, redirectTo]);

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link
              className="flex items-center text-white"
              to={paths.home.getHref()}
            >
              <img className="h-24 w-auto" src={logo} alt="Workflow" />
            </Link>
          </div>

          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>

        <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </>
  );
};
