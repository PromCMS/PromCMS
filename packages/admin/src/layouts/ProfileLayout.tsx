import { MESSAGES } from '@constants';
import { PageLayout } from '@layouts';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

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
