import { apiClient } from '@api';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { queryClient } from 'queryClient';

import { ItemID, User } from '@prom-cms/api-client';

const fetcher: QueryFunction<User> = ({ queryKey }) =>
  apiClient.users.getOne(queryKey[1] as ItemID).then(({ data }) => data.data);

const getUseUserQueryKey = (
  userId: ItemID | undefined
): [string, string | number | undefined] => ['users', userId];

export function useUser(
  itemId: ItemID | undefined,
  config?: Parameters<typeof useQuery<User>>['2']
) {
  return useQuery<User>(getUseUserQueryKey(itemId), fetcher, {
    enabled: !!itemId,
    ...config,
  });
}

useUser.prefetch = (itemId: ItemID) =>
  queryClient.prefetchQuery({
    queryFn: fetcher,
    queryKey: getUseUserQueryKey(itemId),
  });
