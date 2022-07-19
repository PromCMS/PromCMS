import { useGlobalContext } from '@contexts/GlobalContext';
import { SiteLayoutHead } from '@layouts';
import { Loader } from '@components/SiteLoader';
import { NextPage } from '@custom-types';
import { Form } from '@components/pages/LoginPage';

const LoginPage: NextPage = () => {
  const { isBooting } = useGlobalContext();

  // Take care of booting phase
  if (isBooting) return <Loader show={isBooting} />;

  return <Form />;
};

LoginPage.getLayout = (page) => {
  return (
    <>
      <SiteLayoutHead />
      {page}
    </>
  );
};

export default LoginPage;
