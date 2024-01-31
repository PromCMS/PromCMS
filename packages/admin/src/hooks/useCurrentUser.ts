import { CanUserOptions, canUser } from '@utils';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useMemo } from 'react';

import { User, UserRole } from '@prom-cms/api-client';

export const useCurrentUser = () => {
  const { currentUserIsAdmin, currentUser } = useGlobalContext();

  return useMemo(
    () =>
      currentUser && {
        ...(currentUser as User & {
          role: UserRole;
        }),
        isAdmin: !!currentUserIsAdmin,
        can: (payload: Omit<CanUserOptions, 'userRole'>) =>
          currentUser?.role
            ? canUser({
                userRole: currentUser.role as UserRole,
                ...payload,
              })
            : false,
      },
    [currentUser, currentUserIsAdmin]
  );
};
