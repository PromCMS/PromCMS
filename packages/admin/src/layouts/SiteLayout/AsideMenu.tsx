import { pageUrls } from '@constants';
import { Image, Tooltip } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { modelIsCustom } from '@utils';
import clsx from 'clsx';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { FC, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as iconSet from 'tabler-icons-react';
import { Home, Photo } from 'tabler-icons-react';

import logoImage from '../../assets/logos/logo.svg';

const defaultMenuItems: ItemProps[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Files', href: '/files', icon: Photo },
];

const MENU_ICON_SIZE = 28;
const LOGO_SIZE = 40;

export type ItemProps = {
  label: string;
  href: string;
  icon: iconSet.Icon;
  isSingleton?: boolean;
};

export const useConstructedMenuItems = () => {
  const { models, singletons } = useGlobalContext();
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
  const { pathname } = useLocation();

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
          'relative flex cursor-pointer p-1 text-xl text-gray-500 transition-all duration-100',
          isSingleton,
        ])}
        data-is-active={
          href === '/' ? pathname === '/' : pathname.startsWith(href)
        }
      >
        <Icon
          className="m-auto"
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
        className="w-full aspect-square bg-white p-1 rounded-l-prom border items-center justify-center text-white mb-2 relative hidden sm:flex flex-none"
      >
        <Image
          height={LOGO_SIZE}
          width={LOGO_SIZE}
          src={logoImage}
          alt=""
          fit="contain"
          classNames={{
            imageWrapper: clsx('w-full h-full'),
          }}
        />
        <div className="bg-white w-3 h-3 absolute right-[-1px] bottom-[-1px] translate-y-full">
          <div
            style={{ background: 'gray' }}
            className="absolute bottom-0 left-0 rounded-tr-full w-full h-full"
          />
        </div>
      </a>
      <div className="h-full pr-2 pb-0">
        <div className="sticky top-2 left-0 grid gap-2 bg-white border backdrop-blur-lg border-gray-100 rounded-prom shadow-lg p-2 items-center opacity-70 hover:opacity-100 duration-150">
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
