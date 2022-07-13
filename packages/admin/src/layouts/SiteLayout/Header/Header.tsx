import { useState, VFC } from 'react'
import { iconSet } from '@prom-cms/icons'
import { useGlobalContext } from '@contexts/GlobalContext'
import s from './header.module.scss'
import Skeleton from '@components/Skeleton'
import Popover from '@components/Popover'
import PopoverList from '@components/PopoverList'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getInitials } from '@utils'
import { useConstructedMenuItems } from './utils'
import { useTranslation } from 'react-i18next'
import BackendImage from '@components/BackendImage'
import { capitalizeFirstLetter } from '@prom-cms/shared'
import { Tooltip } from '@mantine/core'
import { useCurrentUser } from '@hooks/useCurrentUser'

const Header: VFC = () => {
  const { isBooting } = useGlobalContext()
  const currentUser = useCurrentUser()
  const { asPath, push } = useRouter()
  // TODO remove this and other loading stuff
  const [hasError, setError] = useState(false)
  const menuItems = useConstructedMenuItems()
  const { t } = useTranslation()

  return (
    <header className={s.root}>
      <div className={s.top}>
        <iconSet.Briefcase className="mx-auto h-8 w-8" />
      </div>
      <div className="grid gap-5 py-10">
        {menuItems.map((item) => (
          <Tooltip
            withArrow
            key={item.href}
            label={t(capitalizeFirstLetter(item.label, true))}
            position="right"
            color="gray"
          >
            <Link href={item.href}>
              <a
                className={s.item}
                data-is-active={
                  item.href === '/'
                    ? asPath === '/'
                    : asPath.startsWith(item.href)
                }
              >
                <item.icon className="mr-auto h-8 w-8" />
              </a>
            </Link>
          </Tooltip>
        ))}
      </div>
      <div className={s.bottom}>
        <Popover
          disabled={isBooting || !currentUser}
          placement="right-end"
          offset={[0, 10]}
          buttonContent={
            <>
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
                <p className="m-auto text-lg font-bold tracking-wider">
                  {getInitials(currentUser?.name || '.. ..')}
                </p>
              )}
            </>
          }
        >
          {({ close }) => (
            <PopoverList>
              <PopoverList.Item
                icon={t('User')}
                className="text-blue-500"
                onClick={() => {
                  close()
                  push('/settings/profile')
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
                    close()
                    push('/users')
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
                    close()
                    push('/settings/system')
                  }}
                >
                  {t('Settings')}
                </PopoverList.Item>
              )}
              <PopoverList.Item
                icon={'Logout'}
                className="text-red-500"
                onClick={() => {
                  close()
                  push('/logout')
                }}
              >
                {t('Log off')}
              </PopoverList.Item>
            </PopoverList>
          )}
        </Popover>
      </div>
    </header>
  )
}

export default Header
