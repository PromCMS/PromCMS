import { Loader } from '@components/SiteLoader';
import { Page } from '@custom-types';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useRouterQuery } from 'hooks/useRouterQuery';

import NotFoundPage from '../404';
import { Form } from './_components';

const FinalizeRegistrationPage: Page = () => {
  const { isBooting } = useGlobalContext();
  const token = useRouterQuery('token');

  // Take care of booting phase
  if (isBooting) return <Loader show={isBooting} />;
  if (!token) return <NotFoundPage />;

  return <Form token={token} />;
};

export default FinalizeRegistrationPage;
