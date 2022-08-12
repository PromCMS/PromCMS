import { PageLayout } from '@layouts';
import { FC, PropsWithChildren, useMemo } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';
import { useCurrentUser } from '@hooks/useCurrentUser';
import {
  LanguageHiragana,
  Lock,
  Settings,
  UserCircle,
  UserExclamation,
} from 'tabler-icons-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const items = [
  { title: 'Profile', url: '/settings/profile', Icon: UserCircle },
  {
    title: 'Authentication',
    url: '/settings/password',
    Icon: Lock,
    canBeShown: () => false,
  },
  {
    title: 'User Roles',
    url: '/settings/roles',
    Icon: UserExclamation,
    canBeShown: (currentUser: ReturnType<typeof useCurrentUser>) =>
      currentUser?.role.id === 0,
  },
  {
    title: 'System settings',
    url: '/settings/system',
    Icon: Settings,
    canBeShown: (currentUser: ReturnType<typeof useCurrentUser>) =>
      currentUser?.can({
        action: 'read',
        targetModel: 'settings',
      }),
  },
  {
    title: 'General translations',
    url: '/settings/translations',
    Icon: LanguageHiragana,
  },
];

const LeftAside: FC = () => {
  let navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const filteredItems = useMemo(
    () =>
      currentUser &&
      items.filter(({ canBeShown }) =>
        canBeShown ? canBeShown(currentUser) : true
      ),
    [currentUser]
  );

  return (
    <div className="h-full px-5 pt-6">
      <nav className="mt-24 flex flex-none gap-3 lg:flex-col">
        {filteredItems &&
          filteredItems.map(({ url, title, Icon }) => (
            <Button
              key={url}
              component="a"
              size="lg"
              variant="subtle"
              color={pathname === url ? 'green' : 'blue'}
              className={clsx(
                pathname === url
                  ? 'border-green-300 underline'
                  : 'border-blue-200',
                'border-2 bg-white'
              )}
              styles={() => ({
                inner: {
                  justifyContent: 'space-between',
                },
              })}
              leftIcon={<Icon className="mr-auto aspect-square w-6" />}
              onClick={() => navigate(url, { replace: true })}
            >
              {t(title)}
            </Button>
          ))}
      </nav>
    </div>
  );
};

export const ProfileLayout: FC = () => {
  const { t } = useTranslation();

  return (
    <PageLayout withAside leftAside={<LeftAside />}>
      <PageLayout.Header title={t('Settings')} />

      <PageLayout.Section className="mt-5 min-h-[500px] justify-evenly lg:flex">
        <div className="w-full">
          <Outlet />
        </div>
      </PageLayout.Section>
    </PageLayout>
  );
};
