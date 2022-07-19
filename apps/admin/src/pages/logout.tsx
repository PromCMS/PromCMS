import { useGlobalContext } from '@contexts/GlobalContext';
import { SiteLayoutHead } from '@layouts';
import axios from 'axios';
import { Loader } from '@components/SiteLoader';
import { apiClient } from '@api';
import { API_CURRENT_USER_LOGOUT_URL } from '@constants';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NextPage } from '@custom-types';

const LogoutPage: NextPage = () => {
  const { push } = useRouter();
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
      push('/login');
    }

    return () => cancelToken.cancel();
  }, [isBooting, currentUser, push, updateValue]);

  if (isBooting) return <Loader show={isBooting} />;

  return <>{t('Logging you out...')}</>;
};

LogoutPage.getLayout = (page) => {
  return (
    <>
      <SiteLayoutHead />
      {page}
    </>
  );
};

export default LogoutPage;
