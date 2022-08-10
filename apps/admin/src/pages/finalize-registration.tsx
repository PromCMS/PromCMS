import { useGlobalContext } from '@contexts/GlobalContext';
import { Loader } from '@components/SiteLoader';
import { Form } from '@components/pages/FinalizeRegistration';
import NotFoundPage from './404';
import { Page } from '@custom-types';
import { useRouterQuery } from '@hooks/useRouterQuery';

const FinalizeRegistrationPage: Page = () => {
  const { isBooting } = useGlobalContext();
  const token = useRouterQuery('token');

  // Take care of booting phase
  if (isBooting) return <Loader show={isBooting} />;
  if (!token) return <NotFoundPage />;

  return <Form token={token} />;
};

export default FinalizeRegistrationPage;
