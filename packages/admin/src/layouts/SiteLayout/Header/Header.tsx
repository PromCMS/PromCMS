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
import { UserRoles } from '@prom-cms/shared'

const Header: VFC = () => {
  const { isBooting, currentUser, currentUserIsAdmin } = useGlobalContext()
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
          <Link href={item.href} key={item.href}>
            <a
              className={s.item}
              title={item.label}
              data-is-active={
                item.href === '/'
                  ? asPath === '/'
                  : asPath.startsWith(item.href)
              }
            >
              <item.icon className="mr-auto h-8 w-8" />
            </a>
          </Link>
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
                icon={'User'}
                className="text-blue-500"
                onClick={() => {
                  close()
                  push('/settings/profile')
                }}
              >
                {t('Profile')}
              </PopoverList.Item>
              {(currentUser?.role === UserRoles.Maintainer ||
                currentUserIsAdmin) && (
                <PopoverList.Item
                  icon={'Users'}
                  className="text-blue-500"
                  onClick={() => {
                    close()
                    push('/users')
                  }}
                >
                  {t('Users')}
                </PopoverList.Item>
              )}
              <PopoverList.Item
                icon={'Settings'}
                className="text-blue-500"
                onClick={() => {
                  close()
                  push('/settings')
                }}
              >
                {t('Settings')}
              </PopoverList.Item>
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
