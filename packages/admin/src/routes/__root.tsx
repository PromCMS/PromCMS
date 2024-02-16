import { AuthContext, prefetchAuthContextData } from '@contexts/AuthContext';
import { useInternetConnection } from '@hooks/useInternetConnection';
import { Dialog, Text } from '@mantine/core';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface RouterContext {
  auth?: AuthContext;
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

const OfflineNotification: FC = () => {
  const { isOnline } = useInternetConnection();
  const { t } = useTranslation();

  return (
    <Dialog opened={!isOnline} size="lg" className="rounded-prom bg-orange-100">
      <Text size="md" mb="xs" fw={500} className="text-orange-700">
        💬 {t('Network connection has been lost')}
      </Text>
      <p className="text-orange-700 opacity-75">
        {t(
          "It appears that you're not online, please connect back to a network before proceeding further..."
        )}
      </p>
    </Dialog>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    // useEffect(() => {
    //   const listener = () => {
    //     setCurrentUser(undefined);
    //   };
    //   if (currentUser) {
    //     window.addEventListener('userHasBeenLoggedOff', listener);
    //   }

    //   return () => {
    //     window.removeEventListener('userHasBeenLoggedOff', listener);
    //   };
    // }, [setCurrentUser, currentUser]);

    return (
      <>
        <Outlet />
        <OfflineNotification />
        <TanStackRouterDevtools />
      </>
    );
  },
  async beforeLoad() {
    // The results of this query will be cached like a normal query
    await Promise.all([prefetchAuthContextData()]);
  },
});
