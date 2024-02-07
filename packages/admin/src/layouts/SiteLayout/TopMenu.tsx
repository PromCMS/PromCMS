import BackendImage from '@components/BackendImage';
import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES, pageUrls } from '@constants';
import { useGlobalContext } from '@contexts/GlobalContext';
import useCurrentModel from '@hooks/useCurrentModel';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useSettings } from '@hooks/useSettings';
import { ActionIcon, Button, Collapse, Menu, Skeleton } from '@mantine/core';
import { getInitials } from '@utils';
import clsx from 'clsx';
import { upperFirst } from 'lodash';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  LanguageHiragana,
  Logout,
  Menu2,
  Photo,
  Settings,
  User,
  UserExclamation,
  Users,
  X,
} from 'tabler-icons-react';
import { create as createStore } from 'zustand';

import { ItemProps, useConstructedMenuItems } from './AsideMenu';

const USER_MENU_ICON_SIZE = 16;

const MENU_SUBITEM_CLASSNAMES =
  'group-hover:opacity-100 duration-150 sm:opacity-40';

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
              className="group flex p-2 w-full rounded-prom shadow-sm duration-150 bg-white "
              key={itemInfo.href}
              onClick={toggleOpen}
            >
              <itemInfo.icon className="aspect-square h-7 w-7 text-gray-400 duration-150 group-hover:text-blue-500 p-1" />
              <span className="mt-0.5 block font-semibold ml-3">
                {t(upperFirst(itemInfo.label))}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Collapse>
  );
};

export const TopMenu: FC = () => {
  const { isBooting } = useGlobalContext();
  const currentUser = useCurrentUser();
  const currentModel = useCurrentModel();
  const navigate = useNavigate();
  // TODO remove this and other loading stuff
  const [hasError, setError] = useState(false);
  const settings = useSettings();
  const { t } = useTranslation();
  const location = useLocation();
  const [openedSubmenus, setOpenedSubmenus] = useState<SUBMENU_NAMES[]>([]);
  const mobileMenu = useMobileMenuToggle();

  const isEntryUnderpage = /\/entry-types\/.*/g.test(location.pathname);

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
      className={clsx('relative group sm:hover:mt-0 sm:-mt-5 duration-150')}
      onMouseLeave={() => {
        setOpenedSubmenus([]);
      }}
    >
      <div className="flex p-2 gap-2">
        <div className="w-11 hidden sm:block" />
        <ActionIcon
          className={clsx(
            'relative flex w-9 h-9 overflow-hidden rounded-prom border sm:hidden',
            MENU_SUBITEM_CLASSNAMES
          )}
          color={mobileMenu.open ? 'red' : 'white'}
          variant={mobileMenu.open ? 'filled' : 'light'}
          onClick={mobileMenu.toggleOpen}
        >
          {mobileMenu.open ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu2 className="w-5 h-5" />
          )}
        </ActionIcon>
        {isEntryUnderpage ? (
          <Button
            type="button"
            color="red"
            variant="subtle"
            leftIcon={
              <ArrowLeft className="aspect-square" width={20} height={20} />
            }
            onClick={() =>
              navigate(pageUrls.entryTypes(currentModel?.name as string).list)
            }
            className={MENU_SUBITEM_CLASSNAMES}
          >
            {t(MESSAGES.GO_BACK)}
          </Button>
        ) : null}
        <div className="mr-auto" />
        <Menu
          withArrow
          position="bottom-end"
          arrowPosition="center"
          transition="pop"
          shadow="xl"
          opened={openedSubmenus.includes(SUBMENU_NAMES.CONFIG)}
          onClose={() => toggleSubmenu(SUBMENU_NAMES.CONFIG)}
          onOpen={() => toggleSubmenu(SUBMENU_NAMES.CONFIG)}
        >
          <Menu.Target>
            <ActionIcon
              className={clsx(
                'ml-auto relative flex w-9 h-9 overflow-hidden rounded-prom border border-gray-100 bg-white',
                MENU_SUBITEM_CLASSNAMES
              )}
            >
              <Settings className="w-5 h-5" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {currentUser?.can({
              action: 'read',
              targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.SETTINGS,
            }) ? (
              <Menu.Item
                color="teal"
                icon={<Settings size={USER_MENU_ICON_SIZE} />}
                onClick={() => {
                  navigate('/settings/system');
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
                icon={<Users size={USER_MENU_ICON_SIZE} />}
                onClick={() => {
                  navigate('/users');
                }}
              >
                {t('Users')}
              </Menu.Item>
            ) : null}
            {settings && settings.i18n.languages.length >= 2 ? (
              <Menu.Item
                color="blue"
                icon={<LanguageHiragana size={USER_MENU_ICON_SIZE} />}
                onClick={() => {
                  navigate(
                    pageUrls.settings.translations(settings?.i18n.languages[1])
                      .list
                  );
                }}
              >
                {t(MESSAGES.GENERAL_TRANSLATIONS)}
              </Menu.Item>
            ) : null}
            {currentUser?.isAdmin ? (
              <Menu.Item
                color="orange"
                icon={<UserExclamation size={USER_MENU_ICON_SIZE} />}
                onClick={() => {
                  navigate('/settings/roles');
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
          transition="pop"
          shadow="xl"
          opened={openedSubmenus.includes(SUBMENU_NAMES.USER)}
          onClose={() => toggleSubmenu(SUBMENU_NAMES.USER)}
          onOpen={() => toggleSubmenu(SUBMENU_NAMES.USER)}
        >
          <Menu.Target>
            <ActionIcon
              disabled={isBooting || !currentUser}
              className={clsx(
                'relative flex w-9 h-9 overflow-hidden rounded-prom border border-gray-100 bg-white',
                MENU_SUBITEM_CLASSNAMES
              )}
            >
              {isBooting ? (
                <Skeleton className="absolute left-0 right-0 h-full w-full" />
              ) : currentUser && currentUser.avatar && !hasError ? (
                <BackendImage
                  imageId={currentUser.avatar}
                  alt=""
                  width={40}
                  quality={40}
                  onError={() => setError(true)}
                  className="absolute top-0 left-0 h-full w-full object-cover"
                />
              ) : (
                <p className="m-auto font-bold text-[12px] tracking-wider text-black p-1">
                  {getInitials(currentUser?.name || '-- --')}
                </p>
              )}
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color="blue"
              icon={<User size={USER_MENU_ICON_SIZE} />}
              onClick={() => {
                navigate('/settings/profile');
              }}
              className="font-semibold"
            >
              {t(MESSAGES.MY_PROFILE_BUTTON_TEXT)}
            </Menu.Item>

            <Menu.Divider />
            <Menu.Item
              color="red"
              icon={<Logout size={USER_MENU_ICON_SIZE} />}
              onClick={() => {
                navigate('/logout');
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
