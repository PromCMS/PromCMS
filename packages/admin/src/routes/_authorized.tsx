import ErrorBoundary from '@components/ErrorBoundary';
import {
  EntitiesProvider,
  prefetchEntitiesContextData,
} from '@contexts/EntitiesContext';
import {
  SettingsProvider,
  prefetchSettingsContextData,
} from '@contexts/SettingsContext';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { AsideMenu } from '../layouts/SiteLayout/AsideMenu';
import { TopMenu } from '../layouts/SiteLayout/TopMenu';

export const Route = createFileRoute('/_authorized')({
  component: AuthorizedOnlyPageLayout,
  async beforeLoad({ context }) {
    if (!context.auth?.user) {
      throw redirect({
        to: '/login',
      });
    }

    await Promise.all([
      prefetchSettingsContextData(),
      prefetchEntitiesContextData(),
    ]);
  },
});

function AuthorizedOnlyPageLayout() {
  return (
    <SettingsProvider>
      <EntitiesProvider>
        <TopMenu />
        <div className="flex min-h-screen">
          <AsideMenu />
          <main className="relative w-full">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </EntitiesProvider>
    </SettingsProvider>
  );
}
