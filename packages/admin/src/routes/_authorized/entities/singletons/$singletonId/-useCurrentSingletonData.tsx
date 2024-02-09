import { apiClient } from '@api';
import { useCurrentSingleton } from '@hooks/useCurrentSingleton';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { ResultItem, RichAxiosRequestConfig } from '@prom-cms/api-client';

function fetcher<T extends ResultItem>({
  queryKey,
}: QueryFunctionContext<[string, RichAxiosRequestConfig<T> | undefined]>):
  | T
  | Promise<T> {
  return apiClient.singletons
    .for(queryKey[0])
    .get<T>(queryKey[1])
    .then(({ data }) => data.data);
}

export function useCurrentSingletonData<T extends ResultItem>(
  params?: RichAxiosRequestConfig<T>,
  queryConfig?: Parameters<
    typeof useQuery<
      T,
      unknown,
      undefined,
      [string, RichAxiosRequestConfig<T> | undefined]
    >
  >['2']
) {
  const singleton = useCurrentSingleton(true);

  return useQuery<
    T,
    unknown,
    undefined,
    [string, RichAxiosRequestConfig<T> | undefined]
  >([singleton.key, params], fetcher<T>, queryConfig);
}

useCurrentSingletonData.refetch = () => {};
