import { useGlobalContext } from '@contexts/GlobalContext';
import { Loader } from '@components/SiteLoader';
import { Form } from '@components/pages/ResetPasswordPage';
import { Page } from '@custom-types';

const ResetPasswordPage: Page = () => {
  const { isBooting } = useGlobalContext();

  // Take care of booting phase
  if (isBooting) return <Loader show={isBooting} />;

  return <Form />;
};

export default ResetPasswordPage;
