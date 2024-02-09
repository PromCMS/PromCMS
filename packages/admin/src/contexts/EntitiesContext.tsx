import { apiClient } from '@api';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { queryClient } from 'queryClient';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { ApiResultModels, ApiResultSingletons } from '@prom-cms/api-client';

type EntitiesResponse = {
  models: ApiResultModels | null;
  singletons: ApiResultSingletons | null;
};

export type EntitiesContext = EntitiesResponse;

const FETCH_ENTITIES_QUERY_KEY = 'app-entities';
const entitiesFetcher: QueryFunction<EntitiesResponse> = async ({ signal }) => {
  const [{ data: models }, { data: singletons }] = await Promise.all([
    apiClient.entries.getInfo({ signal }),
    apiClient.singletons.getInfo({ signal }),
  ]);

  return {
    models,
    singletons,
  };
};

export const prefetchEntitiesContextData = async () =>
  queryClient.prefetchQuery({
    queryKey: [FETCH_ENTITIES_QUERY_KEY],
    queryFn: entitiesFetcher,
  });

const entitiesContext = createContext<EntitiesContext>({
  models: null,
  singletons: null,
});

export const useEntities = () => useContext(entitiesContext);

export const EntitiesProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useQuery([FETCH_ENTITIES_QUERY_KEY], entitiesFetcher, {
    refetchInterval: 0,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <entitiesContext.Provider
      value={useMemo(
        () => ({
          models: data?.models ?? null,
          singletons: data?.singletons ?? null,
        }),
        [data]
      )}
    >
      {children}
    </entitiesContext.Provider>
  );
};
