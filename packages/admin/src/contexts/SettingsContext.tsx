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

import { AppConfig } from '@prom-cms/api-client';

export type SettingsContext = {
  application: AppConfig | null;
};

const FETCH_APP_SETTINGS_QUERY_KEY = 'app-settings';
const appSettingsFetcher: QueryFunction<AppConfig> = async ({ signal }) => {
  const request = await apiClient.settings.getAppConfig({ signal });
  return request.data.data;
};

export const prefetchSettingsContextData = async () =>
  Promise.all([
    queryClient.prefetchQuery({
      queryKey: [FETCH_APP_SETTINGS_QUERY_KEY],
      queryFn: appSettingsFetcher,
    }),
  ]);

const settingsContext = createContext<SettingsContext>({
  application: null,
});

export const useSettings = () => useContext(settingsContext);

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useQuery(
    [FETCH_APP_SETTINGS_QUERY_KEY],
    appSettingsFetcher,
    {
      refetchInterval: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <settingsContext.Provider
      value={useMemo(() => ({ application: data ?? null }), [data])}
    >
      {children}
    </settingsContext.Provider>
  );
};
