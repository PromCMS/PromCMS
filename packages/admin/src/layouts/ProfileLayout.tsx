import { PageLayout } from '@layouts'
import { FC, VFC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { iconSet } from '@prom-cms/icons'
import { Button } from '@mantine/core'

const items = [
  { title: 'Profile', url: '/settings/profile', Icon: iconSet.UserCircle },
  { title: 'System', url: '/settings', Icon: iconSet.Settings },
  { title: 'Authentication', url: '/settings/password', Icon: iconSet.Lock },
  {
    title: 'User Roles',
    url: '/settings/user-roles',
    Icon: iconSet.UserExclamation,
  },
]

const LeftAside: VFC = () => {
  const { pathname } = useRouter()
  const { t } = useTranslation()

  return (
    <div className="h-full px-5 pt-6">
      <nav className="mt-24 flex flex-none gap-3 lg:flex-col">
        {items.map(({ url, title, Icon }) => (
          <Link key={url} href={url} passHref>
            <Button
              component="a"
              size="lg"
              variant="subtle"
              color={pathname === url ? 'green' : 'blue'}
              className={clsx(
                pathname === url
                  ? 'border-green-300 underline'
                  : 'border-blue-200',
                'border-2'
              )}
              styles={() => ({
                inner: {
                  justifyContent: 'space-between',
                },
              })}
              leftIcon={<Icon className="mr-auto aspect-square w-6" />}
            >
              {t(title)}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export const ProfileLayout: FC = ({ children }) => {
  const { t } = useTranslation()

  return (
    <PageLayout withAside leftAside={<LeftAside />}>
      <PageLayout.Header title={t('Settings')} />

      <PageLayout.Section className="mt-5 min-h-[500px] justify-evenly lg:flex">
        <div className="w-full">{children}</div>
      </PageLayout.Section>
    </PageLayout>
  )
}
