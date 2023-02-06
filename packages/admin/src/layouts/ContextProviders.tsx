import { FC, PropsWithChildren } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryFunctionContext,
} from '@tanstack/react-query';
import Backend from 'i18next-http-backend';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { localizationConfig } from '@config';
import ThemeProvider from '@components/ThemeProvider';
import { apiClient } from '@api';
import { I18nextProvider, initReactI18next } from 'react-i18next';

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

if (!i18next.isInitialized) {
  i18next
    .use(Backend)
    .use(initReactI18next)
    .use(LanguageDetector)
    .init(localizationConfig);
}

const ContextProviders: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default ContextProviders;
