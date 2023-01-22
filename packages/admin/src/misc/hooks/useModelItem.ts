import { useCallback, useMemo } from 'react';
import { ResultItem } from '@prom-cms/api-client';
import { ItemID } from '@prom-cms/shared';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@api';

export const useModelItem = <T extends ResultItem>(
  modelName: string | undefined,
  itemId: ItemID | undefined,
  axiosConfig?: Parameters<typeof apiClient.entries.getMany<T>>['1'],
  queryConfig?: Parameters<typeof useQuery<T>>['2']
) => {
  const shouldFetch = useMemo(() => itemId !== undefined, [itemId]);
  const fetcher = useCallback(
    () =>
      apiClient.entries
        .getOne<T>(modelName!, itemId!, axiosConfig)
        .then(({ data }) => data.data),
    [modelName, itemId, axiosConfig]
  );
  const key = useMemo(() => [modelName, itemId], [modelName, itemId]);
  const response = useQuery<T>([key, axiosConfig], fetcher, {
    enabled: shouldFetch,
    ...queryConfig,
  });

  return useMemo(() => ({ ...response, key }), [key, response]);
};