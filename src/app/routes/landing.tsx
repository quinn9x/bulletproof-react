import { IconBrandGithub, IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

import logo from '@/assets/react.svg';
import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';

const LandingRouter = () => {
  const navigate = useNavigate();
  const user = useUser();

  const handleStart = () => {
    if (user.data) {
      void navigate(paths.app.dashboard.getHref());
    } else {
      void navigate(paths.auth.login.getHref());
    }
  };

  return (
    <>
      <Head title="Bulletproof React" />

      <div className="flex h-screen items-center bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Bulletproof React</span>
          </h2>
          <img src={logo} alt="vite" className="mx-auto h-25 my-2" />
          <p>Showcasing Best Practices For Building React Applications</p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Button onClick={handleStart}>
                <IconHome stroke={2} /> Get started
              </Button>
            </div>
            <div className="ml-3 inline-flex">
              <a
                href="https://github.com/quinn9x/bulletproof-react"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline">
                  <IconBrandGithub stroke={2} /> Github Repo
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingRouter;
