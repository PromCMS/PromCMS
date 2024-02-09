import { apiClient } from '@api';
import { refetchAuthContextData } from '@contexts/AuthContext';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/logout')({
  component: () => {
    const { t } = useTranslation();
    return <div>{t('Logging you out...')}</div>;
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
