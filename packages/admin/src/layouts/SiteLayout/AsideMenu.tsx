import { pageUrls } from '@constants';
import { useEntities } from '@contexts/EntitiesContext';
import { Image, Tooltip } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { Link, useRouter, useRouterState } from '@tanstack/react-router';
import { modelIsCustom } from '@utils';
import clsx from 'clsx';
import { FC, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as iconSet from 'tabler-icons-react';
import { Home, Photo } from 'tabler-icons-react';

import logoImage from '../../assets/logos/logo.svg';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const defaultMenuItems: ItemProps[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Files', href: '/files', icon: Photo },
];

const MENU_ICON_SIZE = 40;
const LOGO_SIZE = 40;

export type ItemProps = {
  label: string;
  href: string;
  icon: iconSet.Icon;
  isSingleton?: boolean;
};

export const useConstructedMenuItems = () => {
  const { models, singletons } = useEntities();
  const currentUser = useCurrentUser();

  const finalMenuItems = useMemo(() => {
    let finalValue: ItemProps[] = [];

    if (models && currentUser) {
      finalValue = [
        ...finalValue,
        ...Object.entries({ ...singletons, ...models })
          .filter(([modelKey, modelInfo]) => {
            if (modelIsCustom(modelKey || '') || modelInfo.admin.isHidden) {
              return false;
            }

            return (
              currentUser.can({
                action: 'read',
                targetEntityTableName: modelKey,
              }) &&
              (modelKey in models === false
                ? currentUser.can({
                    action: 'update',
                    targetEntityTableName: modelKey,
                  })
                : true)
            );
          })
          .map(([modelKey, { title, admin }]) => {
            const isSingleton = modelKey in models === false;

            return {
              href: isSingleton
                ? pageUrls.singletons.view(modelKey)
                : pageUrls.entryTypes(modelKey).list,
              icon: iconSet[admin.icon],
              label: title || modelKey,
              isSingleton,
            };
          }),
      ].filter((item) => !!item.icon);
    }

    const singletonItems = finalValue.filter(({ isSingleton }) => isSingleton);
    const normalItems = finalValue.filter(({ isSingleton }) => !isSingleton);

    return { singletonItems, normalItems };
  }, [models, currentUser]);

  return finalMenuItems;
};

const Item: FC<ItemProps> = ({ href, label, isSingleton, icon: Icon }) => {
  const { t } = useTranslation();
  const routerState = useRouterState();
  const router = useRouter();

  const currentLocation = routerState.location.pathname.replace(
    router.basepath,
    ''
  );

  const isCurrent =
    href === '/' ? currentLocation === '/' : currentLocation.startsWith(href);

  return (
    <Tooltip
      withinPortal
      withArrow
      offset={20}
      label={t(upperFirst(label))}
      position="right"
      color="gray"
    >
      <Link
        to={href}
        className={clsx([
          'relative flex cursor-pointer p-1 text-xl text-gray-500 dark:text-white transition-all duration-100',
          isSingleton,
        ])}
        data-is-active={isCurrent}
      >
        <Icon
          className={clsx(
            'm-auto p-1',
            isCurrent ? 'bg-blue-100 rounded-prom text-blue-700' : ''
          )}
          strokeWidth={1.3}
          width={MENU_ICON_SIZE}
          height={MENU_ICON_SIZE}
        />
      </Link>
    </Tooltip>
  );
};

export const AsideMenu: FC = () => {
  const menuItems = useConstructedMenuItems();

  const allMenuItems = useMemo(
    () => [defaultMenuItems, menuItems.normalItems, menuItems.singletonItems],
    [menuItems]
  );

  return (
    <nav className="group pl-2 absolute sm:relative z-10 left-0 top-10 sm:top-0 sm:translate-x-0 -translate-x-full flex flex-col">
      <a
        href="/"
        className="w-full aspect-square bg-white dark:bg-gray-800 dark:bg-opacity-60 p-1 rounded-l-prom items-center justify-center text-white mb-2 relative hidden sm:flex flex-none"
      >
        <Image
          height={LOGO_SIZE}
          width={LOGO_SIZE}
          src={logoImage}
          alt=""
          fit="contain"
          className="drop-shadow-2xl"
          w={LOGO_SIZE}
        />
        <div className="bg-white dark:bg-gray-800 dark:bg-opacity-60 w-3 h-3 absolute right-[-1px] bottom-[-1px] translate-y-full">
          <div className="absolute bottom-0 left-0 rounded-tr-full w-full h-full bg-[var(--body-background)] dark:bg-black" />
        </div>
      </a>
      <div className="h-full pr-2 pb-0">
        <div className="sticky top-2 left-0 grid gap-2 bg-white backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-60 rounded-prom dark:shadow-none shadow-lg shadow-blue-100 hover:shadow-blue-200 duration-200 p-1 items-center">
          {allMenuItems.map((items, index) => (
            <Fragment key={index}>
              {items.map((item) => (
                <Item key={item.href} {...item} />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};
