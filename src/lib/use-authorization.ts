import { useUser } from './auth';
import type { Role } from './roles';

export const useAuthorization = () => {
  const user = useUser();

  if (!user.data) {
    throw new Error('User does not exist!');
  }

  const checkAccess = ({ allowedRoles }: { allowedRoles: Role[] }) =>
    allowedRoles.includes(user.data.role);

  return {
    checkAccess,
    role: user.data.role,
  };
};
