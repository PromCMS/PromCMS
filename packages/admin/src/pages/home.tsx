import { useGlobalContext } from '@contexts/GlobalContext';
import { PageLayout } from '@layouts';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import dayjs from 'dayjs';
import { useConstructedMenuItems } from '@layouts';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Page } from '@custom-types';
import { Link } from 'react-router-dom';
const dateFormat = 'dddd DD.MM. YYYY';

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
      <div className="mt-6 text-lg">Today is {currentTime}</div>
      <h1 className="mt-16 text-4xl font-semibold text-blue-400">
        <Trans i18nKey={'Welcome back, {{name}}'} name={currentUser?.name}>
          Welcome back, {{ name: currentUser?.name }}
        </Trans>
      </h1>
      <hr className="mt-7 h-0.5 w-full border-0 bg-project-border" />
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {menuItems.normalItems
          .filter(({ href }) => href !== '/')
          .map((itemInfo) => (
            <Link
              to={itemInfo.href}
              className="group flex aspect-square rounded-2xl shadow-lg shadow-blue-200 hover:no-underline hover:scale-105"
              key={itemInfo.href}
            >
              <div className="m-auto text-center">
                <itemInfo.icon className="mx-auto aspect-square h-12 w-12 text-gray-400 duration-150 group-hover:text-blue-500" />
                <span className="mt-3 block text-xl font-semibold">
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
