import { GlobalContextProvider } from '@contexts/GlobalContext';
import { FC, PropsWithChildren } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryFunctionContext,
} from '@tanstack/react-query';
import { apiClient } from '@api';

const defaultQueryFn = async ({ queryKey }: QueryFunctionContext<any>) => {
  return apiClient.entries
    .getOne(queryKey[0], queryKey[1])
    .then(({ data }) => data.data);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

const ContextProviders: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <GlobalContextProvider>{children}</GlobalContextProvider>
  </QueryClientProvider>
);

export default ContextProviders;
