import { useUser as useUserOriginal } from '@hooks/useUser';
import { useParams } from '@tanstack/react-router';

import { UserUnderpageRoute } from '../$userId';

/**
 * Gets current page user
 */
export const useCurrentUser = () => {
  const { userId } = useParams({
    from: UserUnderpageRoute.id,
  });

  return useUserOriginal(userId);
};
