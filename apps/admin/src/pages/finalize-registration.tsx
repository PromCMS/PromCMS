import { useGlobalContext } from '@contexts/GlobalContext';
import { SiteLayoutHead } from '@layouts';
import { Loader } from '@components/SiteLoader';
import { NextPage } from '@custom-types';
import { Form } from '@components/pages/FinalizeRegistration';
import { useRouter } from 'next/router';
import NotFoundPage from './404';

const FinalizeRegistrationPage: NextPage = () => {
  const { isBooting } = useGlobalContext();
  const { query } = useRouter();

  // Take care of booting phase
  if (isBooting) return <Loader show={isBooting} />;
  if (!query.token) return <NotFoundPage />;

  return <Form token={query.token as string} />;
};

FinalizeRegistrationPage.getLayout = (page) => {
  return (
    <>
      <SiteLayoutHead />
      {page}
    </>
  );
};

export default FinalizeRegistrationPage;
