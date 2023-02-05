import { SiteLayout } from '@layouts';
import ContextProviders from './layouts/ContextProviders';
import { NotificationsProvider } from '@mantine/notifications';
import { Routes, Route } from 'react-router-dom';

import './assets/globals.css';

import MainPage from '@pages/home';
import NotFoundPage from '@pages/404';
import LoginPage from '@pages/login';
import LogoutPage from '@pages/logout';
import FinalizeRegistrationPage from '@pages/finalize-registration';
import ResetPasswordPage from '@pages/reset-password';
import CreateEntryPage from '@pages/entry-types/[modelId]/entries/create';
import EntryUnderPage from '@pages/entry-types/[modelId]/entries/[entryId]';
import EntryDuplicateUnderPage from '@pages/entry-types/[modelId]/entries/duplicate/[entryId]';
import UserProfileMainPage from '@pages/settings/system';
import { ProfileSettingsPage } from '@pages/settings/profile';
import { UserProfilePasswordPage } from '@pages/settings/password';
import UserRolesPage from '@pages/settings/user-roles';
import { lazy, Suspense } from 'react';
import { Loader } from '@components/SiteLoader';
import { CreateTranslationSettings } from '@pages/settings/translations/[lang]/keys/create';
import { GlobalContextProvider } from '@contexts/GlobalContext';

const LazyFilesPage = lazy(() => import('@pages/files'));
const LazyFilePage = lazy(() => import('@pages/files/entries/[fileId]'));
const LazyCreateUserPage = lazy(() => import('@pages/users/invite'));
const LazyUsersListPage = lazy(() => import('@pages/users'));
const LazyUserUnderPage = lazy(() => import('@pages/users/[userId]'));
const LazyEntryTypeUnderpage = lazy(
  () => import('@pages/entry-types/[modelId]')
);
const LazyProfileLayout = lazy(() =>
  import('@layouts').then(({ ProfileLayout }) => ({ default: ProfileLayout }))
);
const LazyGeneralTranslationsPage = lazy(
  () => import('@pages/settings/translations/[lang]')
);
const LazySingletonPage = lazy(() => import('@pages/singletons/[singletonId]'));

export function App() {
  return (
    <GlobalContextProvider>
      <ContextProviders>
        <NotificationsProvider position="top-right">
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route
              path="finalize-registration"
              element={<FinalizeRegistrationPage />}
            />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="/" element={<SiteLayout />}>
              <Route index element={<MainPage />} />
              <Route
                path="files"
                element={
                  <Suspense fallback={<Loader fullScreen={false} />}>
                    <LazyFilesPage />
                  </Suspense>
                }
              >
                <Route path="entries">
                  <Route
                    path=":fileId"
                    element={
                      <Suspense fallback={<Loader fullScreen={false} />}>
                        <LazyFilePage />
                      </Suspense>
                    }
                  />
                </Route>
              </Route>
              <Route path="entry-types/:modelId">
                <Route
                  index
                  element={
                    <Suspense fallback={<Loader fullScreen={false} />}>
                      <LazyEntryTypeUnderpage />
                    </Suspense>
                  }
                />
                <Route path="entries">
                  <Route path="create" element={<CreateEntryPage />} />
                  <Route path=":entryId" element={<EntryUnderPage />} />
                  <Route
                    path="duplicate/:entryId"
                    element={<EntryDuplicateUnderPage />}
                  />
                </Route>
              </Route>
              <Route path="singletons">
                <Route
                  path=":singletonId"
                  element={
                    <Suspense fallback={<Loader fullScreen={false} />}>
                      <LazySingletonPage />
                    </Suspense>
                  }
                />
              </Route>
              <Route
                path="settings"
                element={
                  <Suspense fallback={<Loader fullScreen={false} />}>
                    <LazyProfileLayout />
                  </Suspense>
                }
              >
                <Route path="profile" element={<ProfileSettingsPage />} />
                <Route path="system" element={<UserProfileMainPage />} />
                <Route path="password" element={<UserProfilePasswordPage />} />
                <Route path="roles" element={<UserRolesPage />} />
                <Route
                  path="translations/:lang"
                  element={
                    <Suspense fallback={<Loader fullScreen={false} />}>
                      <LazyGeneralTranslationsPage />
                    </Suspense>
                  }
                >
                  <Route
                    path="keys/create"
                    element={<CreateTranslationSettings />}
                  />
                </Route>
              </Route>
              <Route path="users">
                <Route
                  index
                  element={
                    <Suspense fallback={<Loader fullScreen={false} />}>
                      <LazyUsersListPage />
                    </Suspense>
                  }
                />
                <Route
                  path="invite"
                  element={
                    <Suspense fallback={<Loader fullScreen={false} />}>
                      <LazyCreateUserPage />
                    </Suspense>
                  }
                />
                <Route
                  path=":userId"
                  element={
                    <Suspense fallback={<Loader fullScreen={false} />}>
                      <LazyUserUnderPage />
                    </Suspense>
                  }
                />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <div id="popover-root"></div>
          <div id="modal-root"></div>
          <div id="slide-over-root"></div>
        </NotificationsProvider>
      </ContextProviders>
    </GlobalContextProvider>
  );
}
