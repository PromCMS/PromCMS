import { useAuth } from '@contexts/AuthContext';
import { CanUserOptions, canUser, isAdminRole } from '@utils';
import { useMemo } from 'react';

import { User, UserRole } from '@prom-cms/api-client';

export const useCurrentUser = () => {
  const { user } = useAuth();

  return useMemo(
    () =>
      user && {
        ...(user as User & {
          role: UserRole;
        }),
        isAdmin: !!isAdminRole(user.role),
        can: (payload: Omit<CanUserOptions, 'userRole'>) =>
          user?.role
            ? canUser({
                userRole: user.role as UserRole,
                ...payload,
              })
            : false,
      },
    [user]
  );
};
