import { Loader } from '@components/SiteLoader';
import { Page } from '@custom-types';
import { useGlobalContext } from 'contexts/GlobalContext';

import { Form } from './_components';

const ResetPasswordPage: Page = () => {
  const { isBooting } = useGlobalContext();

  // Take care of booting phase
  if (isBooting) return <Loader show={isBooting} />;

  return <Form />;
};

export default ResetPasswordPage;
