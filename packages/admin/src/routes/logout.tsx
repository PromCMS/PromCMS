import { apiClient } from '@api';
import { MESSAGES } from '@constants';
import { refetchAuthContextData } from '@contexts/AuthContext';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/logout')({
  component: () => {
    const { t } = useTranslation();
    return <div>{t(MESSAGES.LOGOUT_WORKING)}</div>;
  },
  async loader() {
    await apiClient.auth.logout();
    // This should do redirect byitself - or actions leading after that
    await refetchAuthContextData();

    // Redirect, just in case
    throw redirect({
      to: '/login',
    });
  },
});
