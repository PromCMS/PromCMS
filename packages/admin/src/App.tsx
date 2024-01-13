import { Loader } from '@components/SiteLoader';
import { SiteLayout } from '@layouts';
import NotFoundPage from '@pages/404';
import EntryUnderPage from '@pages/entry-types/[modelId]/entries/[entryId]/page';
import CreateEntryPage from '@pages/entry-types/[modelId]/entries/create/page';
import EntryDuplicateUnderPage from '@pages/entry-types/[modelId]/entries/duplicate/[entryId]/page';
import FinalizeRegistrationPage from '@pages/finalize-registration/page';
import MainPage from '@pages/home';
import LoginPage from '@pages/login/page';
import LogoutPage from '@pages/logout';
import ResetPasswordPage from '@pages/reset-password/page';
import { ProfileSettingsPage } from '@pages/settings/profile/page';
import { ChangePasswordPage } from '@pages/settings/profile/password/change/page';
import UserProfileMainPage from '@pages/settings/system';
import { CreateTranslationSettings } from '@pages/settings/translations/[lang]/keys/create';
import UserRolesPage from '@pages/settings/user-roles/page';
import { BlockEditorRefsProvider } from 'contexts/BlockEditorContext';
import { GlobalContextProvider } from 'contexts/GlobalContext';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import './assets/globals.css';
import ContextProviders from './layouts/ContextProviders';

const LazyFilesPage = lazy(() => import('@pages/files/page'));
const LazyFilePage = lazy(() => import('@pages/files/entries/[fileId]'));
const LazyCreateUserPage = lazy(() => import('@pages/users/invite/page'));
const LazyUsersListPage = lazy(() => import('@pages/users/page'));
const LazyUserUnderPage = lazy(() => import('@pages/users/[userId]/page'));
const LazyEntryTypeUnderpage = lazy(
  () => import('@pages/entry-types/[modelId]/page')
);
const LazyProfileLayout = lazy(() =>
  import('@layouts').then(({ ProfileLayout }) => ({ default: ProfileLayout }))
);
const LazyGeneralTranslationsPage = lazy(
  () => import('@pages/settings/translations/[lang]')
);
const LazySingletonPage = lazy(
  () => import('@pages/singletons/[singletonId]/page')
);

export function App() {
  return (
    <Suspense fallback={<Loader fullScreen={false} />}>
      <GlobalContextProvider>
        <BlockEditorRefsProvider>
          <ContextProviders>
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
                  <Route path="profile">
                    <Route path="" element={<ProfileSettingsPage />} />
                    <Route
                      path="password/change"
                      element={<ChangePasswordPage />}
                    />
                  </Route>
                  <Route path="system" element={<UserProfileMainPage />} />
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
          </ContextProviders>
        </BlockEditorRefsProvider>
      </GlobalContextProvider>
    </Suspense>
  );
}
