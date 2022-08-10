import { useGlobalContext } from '@contexts/GlobalContext';
import axios from 'axios';
import { Loader } from '@components/SiteLoader';
import { apiClient } from '@api';
import { API_CURRENT_USER_LOGOUT_URL } from '@constants';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@custom-types';
import { useNavigate } from 'react-router-dom';

const LogoutPage: Page = () => {
  const navigate = useNavigate();
  const { isBooting, currentUser, updateValue } = useGlobalContext();
  const { t } = useTranslation();

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const logoutUser = async () => {
      try {
        await apiClient.get(API_CURRENT_USER_LOGOUT_URL, {
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
  }, [isBooting, currentUser, navigate, updateValue]);

  if (isBooting) return <Loader show={isBooting} />;

  return <>{t('Logging you out...')}</>;
};

export default LogoutPage;
