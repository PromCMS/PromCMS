import { FC, Fragment, useMemo, useState } from 'react';
import { useGlobalContext } from '@contexts/GlobalContext';
import s from './header.module.scss';
import Skeleton from '@components/Skeleton';
import PopoverList from '@components/PopoverList';
import { getInitials } from '@utils';
import { Item as ItemProps, useConstructedMenuItems } from './utils';
import { useTranslation } from 'react-i18next';
import BackendImage from '@components/BackendImage';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import { Popover, Tooltip, UnstyledButton } from '@mantine/core';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { Briefcase, Home, Photo, Settings, Users } from 'tabler-icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import clsx from 'clsx';

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
      label={t(capitalizeFirstLetter(label, true))}
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

const Header: FC = () => {
  const { isBooting } = useGlobalContext();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  // TODO remove this and other loading stuff
  const [hasError, setError] = useState(false);
  const { normalItems: normalMenuItems, singletonItems: singletonMenuItems } =
    useConstructedMenuItems();
  const { t } = useTranslation();
  const [popoverOpened, { close, toggle }] = useDisclosure(false);

  const allMenuItems = useMemo(
    () => [defaultMenuItems, singletonMenuItems, normalMenuItems],
    [singletonMenuItems, normalMenuItems]
  );

  return (
    <header className={s.root}>
      <div className={s.top}>
        <Briefcase className="mx-auto h-10 w-10" />
      </div>
      <div className="grid gap-5 py-10">
        {allMenuItems.map((items, index, everything) => (
          <Fragment key={index}>
            {items.map((item) => (
              <Item key={item.href} {...item} />
            ))}
            {everything[index + 1]?.length && (
              <hr className="-mt-1 -mb-6 ml-auto h-0.5 w-full translate-x-1/2 border-none bg-gray-300" />
            )}
          </Fragment>
        ))}
      </div>
      <div className={s.bottom}>
        <Popover
          withinPortal
          opened={popoverOpened}
          onClose={close}
          position="right-end"
          offset={10}
        >
          <Popover.Target>
            <UnstyledButton
              onClick={toggle}
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
                  {getInitials(currentUser?.name || '.. ..')}
                </p>
              )}
            </UnstyledButton>
          </Popover.Target>
          <Popover.Dropdown>
            <PopoverList>
              <PopoverList.Item
                icon={'User'}
                className="text-blue-500"
                onClick={() => {
                  close();
                  navigate('/settings/profile');
                }}
              >
                {t('Profile')}
              </PopoverList.Item>
              {currentUser?.can({
                action: 'read',
                targetModel: 'users',
              }) && (
                <PopoverList.Item
                  icon={'Users'}
                  className="text-blue-500"
                  onClick={() => {
                    close();
                    navigate('/users');
                  }}
                >
                  {t('Users')}
                </PopoverList.Item>
              )}
              {currentUser?.can({
                action: 'read',
                targetModel: 'settings',
              }) && (
                <PopoverList.Item
                  icon={'Settings'}
                  className="text-blue-500"
                  onClick={() => {
                    close();
                    navigate('/settings/system');
                  }}
                >
                  {t('Settings')}
                </PopoverList.Item>
              )}
              <PopoverList.Item
                icon={'Logout'}
                className="text-red-500"
                onClick={() => {
                  close();
                  navigate('/logout');
                }}
              >
                {t('Log off')}
              </PopoverList.Item>
            </PopoverList>
          </Popover.Dropdown>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
