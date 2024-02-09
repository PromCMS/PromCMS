import { MESSAGES } from '@constants';
import { Outlet } from '@tanstack/react-router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PageLayout } from './PageLayout';

export const ProfileLayout: FC = () => {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <PageLayout.Header title={t(MESSAGES.SETTINGS)} />

      <PageLayout.Section className="mt-5 min-h-[500px] justify-evenly lg:flex">
        <div className="w-full">
          <Outlet />
        </div>
      </PageLayout.Section>
    </PageLayout>
  );
};
