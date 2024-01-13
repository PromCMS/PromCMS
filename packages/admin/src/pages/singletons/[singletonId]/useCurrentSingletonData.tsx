import { apiClient } from '@api';
import { useQuery } from '@tanstack/react-query';
import useCurrentSingleton from 'hooks/useCurrentSingleton';
import { useCallback, useMemo } from 'react';

import { ResultItem, RichAxiosRequestConfig } from '@prom-cms/api-client';

export const useCurrentSingletonData = <T extends ResultItem>(
  axiosConfig?: RichAxiosRequestConfig<T>,
  queryConfig?: Parameters<typeof useQuery<T>>['2']
) => {
  const singleton = useCurrentSingleton(true);

  const fetcher = useCallback(
    () =>
      apiClient.singletons
        .for(singleton.key)
        .get<T>(axiosConfig)
        .then(({ data }) => data.data),
    [singleton, axiosConfig]
  );
  const key = useMemo(() => [singleton.key], [singleton.key]);

  const response = useQuery<T>([key, axiosConfig], fetcher, {
    ...queryConfig,
  });

  return useMemo(() => ({ ...response, key }), [key, response]);
};
