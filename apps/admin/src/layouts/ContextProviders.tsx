import { GlobalContextProvider } from '@contexts/GlobalContext';
import { apiClient } from '@api';
import { FC, PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

const ContextProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url, params = {}) =>
          apiClient
            .get(url, Object.keys(params).length ? { params } : {})
            .then((res) => res.data.data),
      }}
    >
      <GlobalContextProvider>{children}</GlobalContextProvider>
    </SWRConfig>
  );
};

export default ContextProviders;
