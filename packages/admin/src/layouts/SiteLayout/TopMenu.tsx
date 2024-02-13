import BackendImage from '@components/BackendImage';
import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES, pageUrls } from '@constants';
import { useSettings } from '@contexts/SettingsContext';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { ActionIcon, Button, Collapse, Menu } from '@mantine/core';
import { Link, useRouter } from '@tanstack/react-router';
import { getInitials } from '@utils';
import clsx from 'clsx';
import { upperFirst } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Home,
  LanguageHiragana,
  Logout,
  Menu2,
  Moon,
  Photo,
  Settings,
  Sun,
  User,
  UserExclamation,
  Users,
  X,
} from 'tabler-icons-react';
import { create as createStore } from 'zustand';

import useCurrentModel from '../../routes/_authorized/entities/$modelId/-useCurrentModel';
import { ItemProps, useConstructedMenuItems } from './AsideMenu';

const USER_MENU_ICON_SIZE = 14;

const MENU_SUBITEM_CLASSNAMES = clsx(
  'group-hover:opacity-100 duration-150 sm:opacity-50 group-hover:blur-0 sm:blur-sm'
);

const MENU_BUTTON_CLASSNAME =
  'relative flex w-9 h-9 overflow-hidden rounded-prom border border-blue-100 bg-white text-blue-400';

enum SUBMENU_NAMES {
  USER = 'user-submenu',
  CONFIG = 'config-submenu',
}

const defaultMenuItems: ItemProps[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Files', href: '/files', icon: Photo },
];

const useMobileMenuToggle = createStore<{
  open: boolean;
  toggleOpen: () => void;
}>((set, get) => ({
  open: false,
  toggleOpen: () => set({ open: !get().open }),
}));

const MobileMenu: FC = () => {
  const menuItems = useConstructedMenuItems();
  const { t } = useTranslation();
  const { open, toggleOpen } = useMobileMenuToggle();

  const allMenuItems = useMemo(
    () => [
      ...defaultMenuItems,
      ...menuItems.normalItems,
      ...menuItems.singletonItems,
    ],
    [menuItems]
  );

  return (
    <Collapse in={open}>
      <div className="px-2 mb-4">
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          {allMenuItems.map((itemInfo) => (
            <Link
              to={itemInfo.href}
              className="group flex p-2 w-full rounded-prom shadow-sm duration-150 bg-white dark:bg-gray-900 backdrop-blur-md"
              key={itemInfo.href}
              onClick={toggleOpen}
            >
              <itemInfo.icon className="aspect-square h-7 w-7 text-gray-400 dark:text-blue-200 duration-150 group-hover:text-blue-500 p-1" />
              <span className="mt-0.5 block font-semibold ml-3 text-blue-300 dark:text-blue-200">
                {t(upperFirst(itemInfo.label))}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Collapse>
  );
};

const BackButton = () => {
  const router = useRouter();
  const currentModel = useCurrentModel();
  const { t } = useTranslation();
  return (
    <Button
      type="button"
      color="red"
      variant="subtle"
      leftSection={
        <ArrowLeft className="aspect-square" width={20} height={20} />
      }
      onClick={() =>
        router.navigate({
          to: pageUrls.entryTypes(currentModel?.name as string).list,
        })
      }
      className={MENU_SUBITEM_CLASSNAMES}
    >
      {t(MESSAGES.GO_BACK)}
    </Button>
  );
};

export const TopMenu: FC = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  // TODO remove this and other loading stuff
  const [hasError, setError] = useState(false);
  const { t } = useTranslation();
  const [openedSubmenus, setOpenedSubmenus] = useState<SUBMENU_NAMES[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const mobileMenu = useMobileMenuToggle();
  const settings = useSettings();

  const isEntryUnderpage = /\/entry-types\/.+/g.test(location.pathname);

  useEffect(() => {
    if (darkMode) {
      window.document.querySelector('html')?.classList.add('dark');
    } else {
      window.document.querySelector('html')?.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleSubmenu = (submenu: SUBMENU_NAMES) =>
    setOpenedSubmenus((prevValue) => {
      let newValue = new Set([...prevValue]);

      if (newValue.has(submenu)) {
        newValue.delete(submenu);
      } else {
        newValue.add(submenu);
      }

      return [...newValue];
    });

  return (
    <header
      className={clsx(
        'relative sm:hover:mt-0 duration-150 group',
        openedSubmenus.length ? '' : 'sm:-mt-5'
      )}
      // onMouseLeave={() => {
      //   setOpenedSubmenus([]);
      // }}
    >
      <div className="flex p-2 py-2 gap-2">
        <div className="w-11 hidden sm:block" />

        <ActionIcon
          className={clsx(
            'relative flex w-9 h-9 overflow-hidden rounded-prom border sm:hidden',
            MENU_SUBITEM_CLASSNAMES,
            !mobileMenu.open ? 'bg-white text-blue-400' : undefined
          )}
          color={mobileMenu.open ? 'red' : undefined}
          variant={mobileMenu.open ? 'filled' : undefined}
          onClick={mobileMenu.toggleOpen}
        >
          {mobileMenu.open ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu2 className="w-5 h-5" />
          )}
        </ActionIcon>
        {isEntryUnderpage ? <BackButton /> : null}
        <div className="mr-auto" />

        <ActionIcon
          className={clsx(
            'ml-auto relative flex w-[37px] h-[37px] overflow-hidden rounded-prom border bg-white',
            darkMode ? 'border-black' : 'border-transparent',
            MENU_SUBITEM_CLASSNAMES
          )}
          onClick={() => setDarkMode((value) => !value)}
        >
          <div
            className={clsx(
              'absolute top-0 left-0 w-full h-full flex flex-col duration-150',
              !darkMode ? '-translate-y-full' : ''
            )}
          >
            <div className="h-full w-full p-1.5 text-yellow-500 ">
              <Sun className="w-6 h-6" />
            </div>
            <div className="bg-gray-800 text-gray-100 p-1.5 h-full w-full">
              <Moon className="w-6 h-6" fill="inherit" />
            </div>
          </div>
        </ActionIcon>
        <Menu
          withArrow
          position="bottom-end"
          arrowPosition="center"
          transitionProps={{ transition: 'pop' }}
          shadow="xl"
          opened={openedSubmenus.includes(SUBMENU_NAMES.CONFIG)}
          onClose={() => toggleSubmenu(SUBMENU_NAMES.CONFIG)}
          onOpen={() => toggleSubmenu(SUBMENU_NAMES.CONFIG)}
        >
          <Menu.Target>
            <ActionIcon
              className={clsx(MENU_BUTTON_CLASSNAME, MENU_SUBITEM_CLASSNAMES)}
            >
              <Settings className="w-6 h-6" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {currentUser?.can({
              action: 'read',
              targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.SETTINGS,
            }) ? (
              <Menu.Item
                color="teal"
                leftSection={<Settings size={USER_MENU_ICON_SIZE} />}
                onClick={() => {
                  router.navigate({ to: '/settings/system' });
                }}
              >
                {t('System settings')}
              </Menu.Item>
            ) : null}
            {currentUser?.can({
              action: 'read',
              targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.USERS,
            }) ? (
              <Menu.Item
                color="blue"
                leftSection={<Users size={USER_MENU_ICON_SIZE} />}
                onClick={() => {
                  router.navigate({ to: '/users' });
                }}
              >
                {t('Users')}
              </Menu.Item>
            ) : null}
            {(settings.application?.i18n?.languages.length ?? 0) >= 2 ? (
              <Menu.Item
                color="blue"
                leftSection={<LanguageHiragana size={USER_MENU_ICON_SIZE} />}
                onClick={() => {
                  router.navigate({
                    to: pageUrls.settings.translations(
                      settings?.application?.i18n.languages[1]!
                    ).list,
                  });
                }}
              >
                {t(MESSAGES.GENERAL_TRANSLATIONS)}
              </Menu.Item>
            ) : null}
            {currentUser?.isAdmin ? (
              <Menu.Item
                color="orange"
                leftSection={<UserExclamation size={USER_MENU_ICON_SIZE} />}
                onClick={() => {
                  router.navigate({ to: '/settings/user-roles' });
                }}
              >
                {t(MESSAGES.USER_ROLES)}
              </Menu.Item>
            ) : null}
          </Menu.Dropdown>
        </Menu>
        <Menu
          withArrow
          position="bottom-end"
          arrowPosition="center"
          transitionProps={{ transition: 'pop' }}
          shadow="xl"
          opened={openedSubmenus.includes(SUBMENU_NAMES.USER)}
          onClose={() => toggleSubmenu(SUBMENU_NAMES.USER)}
          onOpen={() => toggleSubmenu(SUBMENU_NAMES.USER)}
        >
          <Menu.Target>
            <ActionIcon
              disabled={!currentUser}
              className={clsx(MENU_BUTTON_CLASSNAME, MENU_SUBITEM_CLASSNAMES)}
            >
              {currentUser && currentUser.avatar && !hasError ? (
                <BackendImage
                  imageId={currentUser.avatar.id}
                  alt=""
                  width={40}
                  quality={40}
                  onError={() => setError(true)}
                  className="absolute top-0 left-0 h-full w-full object-cover"
                />
              ) : (
                <p className="m-auto font-bold text-[16px] tracking-wider text-blue-400 p-1">
                  {getInitials(currentUser?.name || '-- --')}
                </p>
              )}
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color="blue"
              leftSection={<User size={USER_MENU_ICON_SIZE} />}
              onClick={() => {
                router.navigate({ to: '/settings/profile' });
              }}
              className="font-semibold"
            >
              {t(MESSAGES.MY_PROFILE_BUTTON_TEXT)}
            </Menu.Item>

            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<Logout size={USER_MENU_ICON_SIZE} />}
              onClick={() => {
                router.navigate({ to: '/logout' });
              }}
            >
              {t(MESSAGES.LOG_OFF)}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <MobileMenu />
    </header>
  );
};
