import { Loader } from '@components/SiteLoader';
import { AuthProvider, useAuth } from '@contexts/AuthContext';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React, { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import './assets/globals.css';
import ContextProviders from './layouts/ContextProviders';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree,
  basepath: '/admin',
  context: {
    auth: undefined,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuth();

  return (
    <RouterProvider basepath={prefix} router={router} context={{ auth }} />
  );
}

// @ts-ignore
const prefix = `${(__APP_URL_PREFIX__ as string) || ''}`;
const rootElement = document.getElementById('prom_cms_root')!;
window.application ??= {};

window.application.root ??= ReactDOM.createRoot(rootElement);
window.application.root.render(
  <StrictMode>
    <Suspense fallback={<Loader fullScreen={false} />}>
      <ContextProviders>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ContextProviders>
    </Suspense>
    <div id="popover-root"></div>
    <div id="modal-root"></div>
    <div id="slide-over-root"></div>
  </StrictMode>
);
rootElement.classList.add('init');
