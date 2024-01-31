import { apiClient } from '@api';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import {
  PagedResponse,
  ResultItem,
  RichAxiosRequestConfig,
} from '@prom-cms/api-client';

export const useModelItems = <T extends ResultItem>(
  modelName: string | undefined,
  axiosConfig?: RichAxiosRequestConfig<T>,
  queryConfig?: Parameters<typeof useQuery<PagedResponse<T>>>['2']
) => {
  const fetcher = useCallback(
    () =>
      apiClient.entries
        .for(modelName!)
        .getMany<T>(axiosConfig)
        .then(({ data }) => data),
    [modelName, axiosConfig]
  );
  const key = useMemo(() => [modelName, axiosConfig], [modelName, axiosConfig]);
  const result = useQuery<PagedResponse<T>>(key, fetcher, queryConfig);

  return useMemo(() => ({ ...result, key }), [key, result]);
};
