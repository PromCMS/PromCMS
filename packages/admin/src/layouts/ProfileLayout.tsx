import { PageLayout } from '@layouts';
import { FC, useMemo } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';
import { useCurrentUser } from '@hooks/useCurrentUser';
import {
  Icon,
  LanguageHiragana,
  Settings,
  UserCircle,
  UserExclamation,
} from 'tabler-icons-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '@hooks/useSettings';
import { MESSAGES, pageUrls } from '@constants';

const LeftAside: FC = () => {
  let navigate = useNavigate();
  const settings = useSettings();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const items = useMemo(() => {
    if (!settings || !currentUser) {
      return [];
    }

    return (
      [
        { title: 'Profile', url: '/settings/profile', Icon: UserCircle },
        /*{
          title: 'Authentication',
          url: '/settings/password',
          Icon: Lock,
          canBeShown: () => false,
        },*/
        {
          title: MESSAGES.USER_ROLES,
          url: '/settings/roles',
          Icon: UserExclamation,
          canBeShown: currentUser?.role.id === 0,
        },
        {
          title: MESSAGES.SYSTEM_SETTINGS,
          url: '/settings/system',
          Icon: Settings,
          canBeShown: !!currentUser?.can({
            action: 'read',
            targetModel: 'settings',
          }),
        },
        {
          title: MESSAGES.GENERAL_TRANSLATIONS,
          url: pageUrls.settings.translations(settings?.i18n.languages[1]).list,
          isInUrl(currentUrl) {
            return currentUrl.startsWith(
              pageUrls.settings
                .translations(settings?.i18n.languages[1])
                .list.replace(settings?.i18n.languages[1], '')
            );
          },
          Icon: LanguageHiragana,
          canBeShown: settings && settings.i18n.languages.length >= 2,
        },
      ] as {
        title: string;
        url: string;
        Icon: Icon;
        isInUrl?: (currentUrl: string) => boolean;
        canBeShown?: boolean;
      }[]
    ).filter((item) => item.canBeShown || item.canBeShown === undefined);
  }, [settings, currentUser]);

  return (
    <div className="h-full px-5 pt-6">
      <nav className="mt-24 flex flex-none gap-3 lg:flex-col">
        {items &&
          items.map(({ url, title, Icon, isInUrl }) => (
            <Button
              key={url}
              component="a"
              size="lg"
              variant="subtle"
              color={pathname === url ? 'green' : 'blue'}
              className={clsx(
                (isInUrl === undefined ? pathname === url : isInUrl(pathname))
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
      <PageLayout.Header title={t(MESSAGES.SETTINGS)} />

      <PageLayout.Section className="mt-5 min-h-[500px] justify-evenly lg:flex">
        <div className="w-full">
          <Outlet />
        </div>
      </PageLayout.Section>
    </PageLayout>
  );
};
