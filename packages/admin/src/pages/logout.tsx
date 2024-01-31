import { apiClient } from '@api';
import { Loader } from '@components/SiteLoader';
import { Page } from '@custom-types';
import axios from 'axios';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LogoutPage: Page = () => {
  const navigate = useNavigate();
  const { isBooting, currentUser, updateValue } = useGlobalContext();
  const { t } = useTranslation();

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const logoutUser = async () => {
      try {
        await apiClient.auth.logout({
          cancelToken: cancelToken.token,
        });
        updateValue('currentUser', undefined);
      } finally {
      }
    };

    if (!isBooting && !!currentUser) {
      logoutUser();
    } else if (!isBooting && !currentUser) {
      // User is not logged in so kick user to login page
      navigate('/login');
    }

    return () => cancelToken.cancel();
  }, [isBooting, currentUser]);

  if (isBooting) return <Loader show={isBooting} />;

  return <>{t('Logging you out...')}</>;
};

export default LogoutPage;
