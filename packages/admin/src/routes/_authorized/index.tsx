import BackendImage from '@components/BackendImage';
import { MESSAGES } from '@constants';
import { useAuth } from '@contexts/AuthContext';
import { PageLayout } from '@layouts/PageLayout';
import { useConstructedMenuItems } from '@layouts/SiteLayout/AsideMenu';
import { Link, createFileRoute } from '@tanstack/react-router';
import { getInitials } from '@utils';
import dayjs from 'dayjs';
import { upperFirst } from 'lodash';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_authorized/')({
  component: LayoutComponent,
});

const dateFormat = 'dddd DD. MMMM YYYY';

function LayoutComponent() {
  const { user } = useAuth();
  const menuItems = useConstructedMenuItems();
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(dayjs().format(dateFormat));

  useEffect(() => {
    const time = window.setTimeout(
      () => setCurrentTime(dayjs().format(dateFormat)),
      60000
    );

    return () => window.clearTimeout(time);
  }, []);

  return (
    <PageLayout>
      <PageLayout.Header>
        <div className="pt-1 text-lg">
          <Trans
            t={t}
            i18nKey={MESSAGES.TODAY_IS_DATE}
            values={{ date: upperFirst(currentTime) }}
          >
            Today is {{ date: upperFirst(currentTime) }}
          </Trans>
        </div>
        <div className="mt-12 mb-7">
          <p className="text-xl font-semibold text-blue-400">
            {t(MESSAGES.WELCOME_USER)},
          </p>
          <div className="mt-3 flex items-start">
            <div className="w-20 h-20 relative bg-gray-50 flex rounded-prom shadow-blue-100 shadow-sm flex-none">
              {user && user.avatar ? (
                <BackendImage
                  imageId={user.avatar.id}
                  alt=""
                  width={80}
                  quality={60}
                  className="absolute top-0 left-0 h-full w-full object-cover"
                />
              ) : (
                <p className="m-auto font-bold text-xl tracking-wider text-blue-400 p-1">
                  {getInitials(user?.name || '-- --')}
                </p>
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl mt-2 mb-0">{user?.name}</h2>
              <p className="mt-0 text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </PageLayout.Header>

      <PageLayout.Content>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:grid-cols-4">
          {menuItems.normalItems
            .filter(({ href }) => href !== '/')
            .map((itemInfo) => (
              <Link
                to={itemInfo.href}
                className="group flex items-center rounded-prom hover:no-underline hover:scale-105 duration-150 border-2 border-blue-100 bg-opacity-70 bg-blue-50 p-2"
                key={itemInfo.href}
              >
                <itemInfo.icon className="aspect-square h-12 w-12 text-blue-400 duration-150 bg-white p-1.5 rounded-prom border-2 border-blue-100" />
                <span className="block text-lg font-semibold ml-2 text-blue-600">
                  {t(upperFirst(itemInfo.label))}
                </span>
              </Link>
            ))}
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
