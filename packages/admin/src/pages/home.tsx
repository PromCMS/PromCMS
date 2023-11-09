import { useGlobalContext } from '@contexts/GlobalContext';
import { PageLayout } from '@layouts';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import dayjs from 'dayjs';
import { useConstructedMenuItems } from '@layouts';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Page } from '@custom-types';
import { Link } from 'react-router-dom';
import { MESSAGES } from '@constants';
const dateFormat = 'dddd DD. MMMM YYYY';

const MainPage: Page = () => {
  const { currentUser } = useGlobalContext();
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
      <div className="mt-6 text-lg">
        <Trans
          t={t}
          i18nKey={MESSAGES.TODAY_IS_DATE}
          values={{ date: capitalizeFirstLetter(currentTime) }}
        >
          Today is {{ date: capitalizeFirstLetter(currentTime) }}
        </Trans>
      </div>
      <h1 className="mt-16 text-4xl font-semibold text-blue-400">
        <Trans
          t={t}
          i18nKey={MESSAGES.WELCOME_USER}
          values={{ name: currentUser?.name }}
        >
          Welcome back, {{ name: currentUser?.name }}
        </Trans>
      </h1>
      <hr className="mt-7 h-0.5 w-full border-0 bg-project-border" />
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
                  {t(capitalizeFirstLetter(itemInfo.label, false))}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </PageLayout>
  );
};

export default MainPage;
