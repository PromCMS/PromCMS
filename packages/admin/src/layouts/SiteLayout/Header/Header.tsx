import { FC, useState } from 'react';
import { useGlobalContext } from '@contexts/GlobalContext';
import s from './header.module.scss';
import Skeleton from '@components/Skeleton';
import PopoverList from '@components/PopoverList';
import { getInitials } from '@utils';
import { useConstructedMenuItems } from './utils';
import { useTranslation } from 'react-i18next';
import BackendImage from '@components/BackendImage';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import { Popover, Tooltip, UnstyledButton } from '@mantine/core';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { Briefcase } from 'tabler-icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';

const Header: FC = () => {
  const { isBooting } = useGlobalContext();
  const currentUser = useCurrentUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // TODO remove this and other loading stuff
  const [hasError, setError] = useState(false);
  const menuItems = useConstructedMenuItems();
  const { t } = useTranslation();
  const [popoverOpened, { close, toggle }] = useDisclosure(false);

  return (
    <header className={s.root}>
      <div className={s.top}>
        <Briefcase className="mx-auto h-8 w-8" />
      </div>
      <div className="grid gap-5 py-10">
        {menuItems.map((item) => (
          <Tooltip
            withinPortal
            withArrow
            offset={-25}
            key={item.href}
            label={t(capitalizeFirstLetter(item.label, true))}
            position="right"
            color="gray"
          >
            <Link
              to={item.href}
              className={s.item}
              data-is-active={
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              }
            >
              <item.icon className="mr-auto h-8 w-8" />
            </Link>
          </Tooltip>
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
                  quality={40}
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
                icon={t('User')}
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
                  icon={t('Users')}
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
                  icon={t('Settings')}
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
