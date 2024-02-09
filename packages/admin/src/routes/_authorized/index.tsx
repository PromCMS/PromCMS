import { MESSAGES } from '@constants';
import { useAuth } from '@contexts/AuthContext';
import { PageLayout } from '@layouts/PageLayout';
import { useConstructedMenuItems } from '@layouts/SiteLayout/AsideMenu';
import { Link, createFileRoute } from '@tanstack/react-router';
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
        <div className="pt-8 text-lg">
          <Trans
            t={t}
            i18nKey={MESSAGES.TODAY_IS_DATE}
            values={{ date: upperFirst(currentTime) }}
          >
            Today is {{ date: upperFirst(currentTime) }}
          </Trans>
        </div>
        <h1 className="mt-16 text-4xl font-semibold text-blue-400">
          <Trans
            t={t}
            i18nKey={MESSAGES.WELCOME_USER}
            values={{ name: user?.name }}
          >
            Welcome back, {{ name: user?.name }}
          </Trans>
        </h1>
      </PageLayout.Header>

      <PageLayout.Content>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4 md:grid-cols-6">
          {menuItems.normalItems
            .filter(({ href }) => href !== '/')
            .map((itemInfo) => (
              <Link
                to={itemInfo.href}
                className="group flex aspect-square rounded-2xl shadow-lg shadow-blue-200 hover:no-underline hover:scale-105 duration-150"
                key={itemInfo.href}
              >
                <div className="m-auto text-center">
                  <itemInfo.icon className="mx-auto aspect-square h-12 w-12 text-gray-400 duration-150 group-hover:text-blue-500" />
                  <span className="mt-3 block text-lg font-semibold">
                    {t(upperFirst(itemInfo.label))}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
