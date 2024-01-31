import BackendImage from '@components/BackendImage';
import Skeleton from '@components/Skeleton';
import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES, pageUrls } from '@constants';
import { useSettings } from '@hooks/useSettings';
import { Image, Menu, Tooltip, UnstyledButton } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { getInitials } from '@utils';
import clsx from 'clsx';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { FC, Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  LanguageHiragana,
  Logout,
  Photo,
  Settings,
  User,
  UserExclamation,
  Users,
} from 'tabler-icons-react';

import logoImage from '../../../assets/logos/logo.svg';
import s from './header.module.scss';
import { Item as ItemProps, useConstructedMenuItems } from './utils';

const defaultMenuItems: ItemProps[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Files', href: '/files', icon: Photo },
];

const Item: FC<ItemProps> = ({ href, label, isSingleton, icon: Icon }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <Tooltip
      withinPortal
      withArrow
      offset={-25}
      label={t(upperFirst(label))}
      position="right"
      color="gray"
    >
      <Link
        to={href}
        className={clsx([s.item, isSingleton])}
        data-is-active={
          href === '/' ? pathname === '/' : pathname.startsWith(href)
        }
      >
        <Icon className="mr-auto h-8 w-8" />
      </Link>
    </Tooltip>
  );
};

const USER_MENU_ICON_SIZE = 16;

const Header: FC = () => {
  const { isBooting } = useGlobalContext();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  // TODO remove this and other loading stuff
  const [hasError, setError] = useState(false);
  const { normalItems: normalMenuItems, singletonItems: singletonMenuItems } =
    useConstructedMenuItems();
  const { t } = useTranslation();
  const settings = useSettings();

  const allMenuItems = useMemo(
    () => [defaultMenuItems, singletonMenuItems, normalMenuItems],
    [singletonMenuItems, normalMenuItems]
  );

  return (
    <header className={s.root}>
      <div className="flex items-center justify-center text-white py-4">
        <a
          href="/"
          title={t('Go home')}
          className="block mx-auto bg-white p-1 rounded-lg border shadow"
        >
          <Image
            height={50}
            width={50}
            src={logoImage}
            alt=""
            fit="contain"
            classNames={{
              imageWrapper: clsx('w-full h-full'),
            }}
          />
        </a>
      </div>
      <div className="grid gap-5 py-5">
        {allMenuItems.map((items, index, everything) => (
          <Fragment key={index}>
            {items.map((item) => (
              <Item key={item.href} {...item} />
            ))}
            {everything[index + 1]?.length ? (
              <hr className="-mt-0.5 -mb-6 ml-auto h-0.5 w-full translate-x-[70%] border-none bg-gray-300 opacity-70" />
            ) : null}
          </Fragment>
        ))}
      </div>
      <div className={s.bottom}>
        <Menu
          withinPortal
          position="right-end"
          withArrow
          arrowPosition="center"
          transition="pop"
        >
          <Menu.Target>
            <UnstyledButton
              disabled={isBooting || !currentUser}
              sx={{
                width: 60,
                height: 60,
              }}
            >
              {isBooting ? (
                <Skeleton className={s.skeleton} />
              ) : currentUser && currentUser.avatar && !hasError ? (
                <BackendImage
                  imageId={currentUser.avatar}
                  alt=""
                  width={60}
                  quality={60}
                  onError={() => setError(true)}
                />
              ) : (
                <p className="m-auto text-lg font-bold tracking-wider text-black">
                  {getInitials(currentUser?.name || '-- --')}
                </p>
              )}
            </UnstyledButton>
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
              {t('Profile')}
            </Menu.Item>
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
            <Menu.Divider />
            <Menu.Item
              color="red"
              icon={<Logout size={USER_MENU_ICON_SIZE} />}
              onClick={() => {
                navigate('/logout');
              }}
            >
              {t('Log off')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
