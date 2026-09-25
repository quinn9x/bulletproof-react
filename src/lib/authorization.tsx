import { type ReactNode } from 'react';

import type { Role } from './roles';
import { useAuthorization } from './use-authorization';

type AuthorizationProps = {
  forbiddenFallback?: ReactNode;
  children: ReactNode;
} & (
  | {
      allowedRoles: Role[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  const canAccess =
    allowedRoles !== undefined ? checkAccess({ allowedRoles }) : policyCheck;

  return canAccess ? <>{children}</> : <>{forbiddenFallback}</>;
};
