import { useGlobalContext } from '@contexts/GlobalContext';
import { Loader } from '@components/SiteLoader';
import { Page } from '@custom-types';
import { Form } from './_components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
