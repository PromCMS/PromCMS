import { apiClient } from '@api';
import useCurrentSingleton from '@hooks/useCurrentSingleton';
import { ResultItem } from '@prom-cms/api-client';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export const useCurrentSingletonData = <T extends ResultItem>(
  axiosConfig?: Parameters<typeof apiClient.entries.getMany<T>>['1'],
  queryConfig?: Parameters<typeof useQuery<T>>['2']
) => {
  const singleton = useCurrentSingleton(true);

  const fetcher = useCallback(
    () =>
      apiClient.singletons
        .getOne(singleton.key, axiosConfig)
        .then(({ data }) => data.data),
    [singleton, axiosConfig]
  );
  const key = useMemo(() => [singleton.key], [singleton.key]);
  const response = useQuery<T>([key, axiosConfig], fetcher, {
    ...queryConfig,
  });

  return useMemo(() => ({ ...response, key }), [key, response]);
};
