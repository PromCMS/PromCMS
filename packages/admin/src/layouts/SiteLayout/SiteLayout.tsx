import ErrorBoundary from '@components/ErrorBoundary';
import { useGlobalContext } from 'contexts/GlobalContext';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Loader } from '../../components/SiteLoader';
import { AsideMenu } from './AsideMenu';
import { TopMenu } from './TopMenu';

const SiteLayout: FC = () => {
  const { isBooting } = useGlobalContext();

  return (
    <>
      <Loader show={isBooting} />

      {}

      {!isBooting && (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            body {
              background: gray;
            }
          `,
            }}
          ></style>
          <TopMenu />
          <div className="flex min-h-screen">
            <AsideMenu />
            <main className="relative w-full">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default SiteLayout;
