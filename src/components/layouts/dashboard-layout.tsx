import { type ReactNode } from 'react';

import {
  IconFolder,
  IconHome,
  IconLayoutSidebar,
  IconUser,
  type Icon,
} from '@tabler/icons-react';
import { NavLink, useLocation, useNavigate, useNavigation } from 'react-router';

import logo from '@/assets/react.svg';
import { paths } from '@/config/paths';
import { useLogout } from '@/lib/auth';
import { ROLES } from '@/lib/roles';
import { useAuthorization } from '@/lib/use-authorization';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Link } from '../ui/link';

type DashboardLayoutProps = {
  children: ReactNode;
};

type SideNavigationItem = {
  name: string;
  to: string;
  icon: Icon;
  end?: boolean;
};

const Logo = () => {
  return (
    <Link className="flex items-center text-white" to={paths.home.getHref()}>
      <img className="h-8 w-auto mr-2" src={logo} alt="Workflow" />
      <span className="text-sm font-semibold text-white">
        Bulletproof React
      </span>
    </Link>
  );
};

const Navigation = ({ items }: { items: SideNavigationItem[] }) => {
  return (
    <nav className="flex flex-col items-center gap-2 px-2 py-4">
      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'group flex w-full items-center rounded-md p-2 text-base font-medium',
              'text-gray-300 hover:bg-gray-700 hover:text-white',
              isActive && 'bg-gray-900 text-white',
            )
          }
        >
          <item.icon
            className={cn(
              'mr-4 size-6 shrink-0 text-gray-400',
              'group-hover:text-gray-300',
            )}
            aria-hidden="true"
          />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};

const NavigationProgress = () => {
  const { state } = useNavigation();

  if (state !== 'loading') {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden"
      aria-hidden="true"
    >
      <div className="h-full w-1/3 animate-navigation-progress rounded-r-full bg-blue-500" />
    </div>
  );
};

const UserMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useLogout({
    onSuccess: () => {
      void navigate(paths.auth.login.getHref(location.pathname));
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <span className="sr-only">Open user menu</span>
            <IconUser stroke={1.5} className="size-6 rounded-full" />
          </Button>
        }
      />

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(paths.app.profile.getHref())}>
          Your Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout.mutate({})}
          disabled={logout.isPending}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { checkAccess } = useAuthorization();

  const navigation: SideNavigationItem[] = [
    {
      name: 'Dashboard',
      to: paths.app.dashboard.getHref(),
      icon: IconHome,
      end: true,
    },
    {
      name: 'Discussions',
      to: paths.app.discussions.getHref(),
      icon: IconFolder,
      end: false,
    },
    ...(checkAccess({ allowedRoles: [ROLES.ADMIN] })
      ? [
          {
            name: 'Users',
            to: paths.app.users.getHref(),
            icon: IconUser,
            end: true,
          },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavigationProgress />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-black sm:flex">
        <div className="flex h-16 shrink-0 items-center px-4">
          <Logo />
        </div>

        <Navigation items={navigation} />
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:justify-end sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile navigation */}
          <Drawer>
            <DrawerTrigger
              render={
                <Button size="icon" variant="outline" className="sm:hidden">
                  <IconLayoutSidebar stroke={1} className="size-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              }
            />

            <DrawerContent
              dir="left"
              className="bg-black pt-10 text-white sm:max-w-60"
            >
              <div className="flex h-16 shrink-0 items-center px-4">
                <Logo />
              </div>

              <Navigation items={navigation} />
            </DrawerContent>
          </Drawer>

          <UserMenu />
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
