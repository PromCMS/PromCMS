import { FC } from 'react';
import { Header } from './Header';
import { useGlobalContext } from '@contexts/GlobalContext';
import { Loader } from '../../components/SiteLoader';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '@components/ErrorBoundary';

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
