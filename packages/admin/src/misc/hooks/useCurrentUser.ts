import { useGlobalContext } from '@contexts/GlobalContext'
import { User, UserRole } from '@prom-cms/shared'
import { canUser, CanUserOptions } from '@utils'
import { useMemo } from 'react'

export const useCurrentUser = () => {
  const { currentUserIsAdmin, currentUser } = useGlobalContext()

  return useMemo(
    () =>
      currentUser && {
        ...(currentUser as User & {
          role: UserRole
        }),
        isAdmin: !!currentUserIsAdmin,
        can: (payload: Omit<CanUserOptions, 'userRole'>) =>
          currentUser?.role
            ? canUser({
                userRole: currentUser?.role as UserRole,
                ...payload,
              })
            : false,
      },
    [currentUser, currentUserIsAdmin]
  )
}
