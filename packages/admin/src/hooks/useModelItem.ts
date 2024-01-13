import { apiClient } from '@api';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import {
  ItemID,
  ResultItem,
  RichAxiosRequestConfig,
} from '@prom-cms/api-client';

export const useModelItem = <T extends ResultItem>(
  modelName: string | undefined,
  itemId: ItemID | undefined,
  axiosConfig?: RichAxiosRequestConfig<T>,
  queryConfig?: Parameters<typeof useQuery<T>>['2']
) => {
  const shouldFetch = useMemo(() => itemId !== undefined, [itemId]);
  const fetcher = useCallback(
    () =>
      apiClient.entries
        .for(modelName!)
        .getOne<T>(itemId!, axiosConfig)
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
