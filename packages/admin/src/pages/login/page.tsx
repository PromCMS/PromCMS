import { Loader } from '@components/SiteLoader';
import { Page } from '@custom-types';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Form } from './_components';

const LoginPage: Page = () => {
  const { isBooting, isLoggedIn } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Take care of booting phase
  if (isBooting) return <Loader show={isBooting} />;

  return <Form />;
};

export default LoginPage;
