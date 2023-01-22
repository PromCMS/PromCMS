import { useGlobalContext } from '@contexts/GlobalContext';
import { Loader } from '@components/SiteLoader';
import { Form } from '@components/pages/LoginPage';
import { Page } from '@custom-types';

const LoginPage: Page = () => {
  const { isBooting } = useGlobalContext();

  // Take care of booting phase
  if (isBooting) return <Loader show={isBooting} />;

  return <Form />;
};

export default LoginPage;
