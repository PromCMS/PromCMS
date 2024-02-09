import { apiClient } from '@api';
import { API_SETTINGS_URL } from '@constants';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { queryClient } from 'queryClient';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';

// TODO: Move to api client
type AppSettingsResponse = {
  i18n: { default: string; languages: string[] };
  app: { name: string; url: string; prefix: string; baseUrl: string };
};

export type SettingsContext = {
  application: AppSettingsResponse | null;
};

const FETCH_APP_SETTINGS_QUERY_KEY = 'app-settings';
const appSettingsFetcher: QueryFunction<AppSettingsResponse> = async ({
  signal,
}) => {
  const request = await apiClient
    .getAxios()
    .get<{ data: AppSettingsResponse }>(API_SETTINGS_URL, {
      signal,
    });

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
