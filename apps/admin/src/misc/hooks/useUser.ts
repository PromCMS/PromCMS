import { apiClient } from "@api";
import { ItemID, User } from '@prom-cms/shared';
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const fetcher = (id: ItemID | undefined) => () => apiClient.users.getOne(id!).then(({ data }) => data.data)
export const useUser = (
  itemId: ItemID | undefined,
  config?: Parameters<typeof useQuery<User>>["2"]
) => {
  const key = useMemo(() => ['users', itemId], [itemId])
  const result = useQuery<User>(key, fetcher(itemId), {
    enabled: !!itemId,
    ...config
  });

  return useMemo(() =>({...result, key}), [key, result])
}
