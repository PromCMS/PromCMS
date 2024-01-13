import { apiClient } from '@api';
import ThemeProvider from '@components/ThemeProvider';
import { localizationConfig } from '@config';
import { NotificationsProvider } from '@mantine/notifications';
import {
  QueryClient,
  QueryClientProvider,
  QueryFunctionContext,
} from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/cs';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { FC, PropsWithChildren } from 'react';
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from 'react-i18next';

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
  i18next.use(initReactI18next).use(LanguageDetector).init(localizationConfig);

  i18next.on('languageChanged', (nextLanguage) => dayjs.locale(nextLanguage));

  dayjs.locale(i18next.language);
}

const LanguageLoader: FC = () => {
  const { i18n } = useTranslation();

  // useEffect(() => {
  //   if (i18n.language) {
  //     i18n.addResourceBundle(
  //       i18n.language,
  //       'translation',
  //       {
  //         ...i18n.getResourceBundle(i18n.language, 'translation'),
  //       },
  //       true,
  //       true
  //     );
  //   }
  // }, [i18n.language]);

  return <></>;
};

const ContextProviders: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nextProvider i18n={i18next}>
        <LanguageLoader />
        <NotificationsProvider position="top-right">
          {children}
        </NotificationsProvider>
      </I18nextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default ContextProviders;
