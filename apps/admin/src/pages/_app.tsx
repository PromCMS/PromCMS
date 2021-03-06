import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SiteLayout } from '@layouts';
import ContextProviders from '../layouts/ContextProviders';
import { NotificationsProvider } from '@mantine/notifications';
import Backend from 'i18next-http-backend';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { localizationConfig } from '@config';
import ThemeProvider from '@components/ThemeProvider';

if (!i18next.isInitialized) {
  i18next
    .use(Backend)
    .use(initReactI18next)
    .use(LanguageDetector)
    .init(localizationConfig);
}

function MyApp({ Component, pageProps }: AppProps) {
  // Use the layout defined at the page level, if available
  const getLayout =
    (Component as any).getLayout || ((page) => <SiteLayout>{page}</SiteLayout>);

  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18next}>
        <ContextProviders>
          <NotificationsProvider position="top-right">
            {getLayout(<Component {...pageProps} />)}
            <div id="popover-root"></div>
            <div id="modal-root"></div>
            <div id="slide-over-root"></div>
          </NotificationsProvider>
        </ContextProviders>
      </I18nextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
