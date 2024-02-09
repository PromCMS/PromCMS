import ThemeProvider from '@components/ThemeProvider';
import { localizationConfig } from '@config';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/cs';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { FC, PropsWithChildren } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import { queryClient } from '../queryClient';

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).use(LanguageDetector).init(localizationConfig);

  i18next.on('languageChanged', (nextLanguage) => dayjs.locale(nextLanguage));

  dayjs.locale(i18next.language);
}

const ContextProviders: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nextProvider i18n={i18next}>
        <NotificationsProvider position="top-right">
          {children}
        </NotificationsProvider>
      </I18nextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default ContextProviders;
