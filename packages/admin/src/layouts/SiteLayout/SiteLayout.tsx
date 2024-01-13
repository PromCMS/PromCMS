import ErrorBoundary from '@components/ErrorBoundary';
import { useGlobalContext } from 'contexts/GlobalContext';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Loader } from '../../components/SiteLoader';
import { Header } from './Header';

const SiteLayout: FC = () => {
  const { isBooting } = useGlobalContext();

  return (
    <>
      <Loader show={isBooting} />

      {!isBooting && (
        <div className="flex min-h-screen">
          <Header />
          <main className="relative w-full border-l-2 border-project-border bg-gray-50">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      )}

      {/*<Footer />*/}
    </>
  );
};

export default SiteLayout;
