import { PageLayout } from '@layouts'
import { FC, VFC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { iconSet } from '@prom-cms/icons'

const items = [
  { title: 'Profile', url: '/settings/profile', Icon: iconSet.UserCircle },
  { title: 'System', url: '/settings', Icon: iconSet.Settings },
  { title: 'Authentication', url: '/settings/password', Icon: iconSet.Lock },
]

const LeftAside: VFC = () => {
  const { pathname } = useRouter()
  const { t } = useTranslation()

  return (
    <div className="h-full px-5 pt-6">
      <p className="text-4xl font-semibold">{t('Menu')}</p>
      <hr className="mt-4 h-0 border-t-4 border-gray-200" />
      <nav className="mt-5 flex flex-none gap-3 overflow-auto lg:flex-col">
        {items.map(({ url, title, Icon }) => (
          <Link key={url} href={url}>
            <a
              className={clsx(
                'block flex-none rounded-lg border-2 bg-white py-2 pr-6 font-semibold text-gray-600 transition-all duration-200',
                pathname === url ? 'border-blue-200' : 'border-project-border'
              )}
            >
              <Icon className="relative -top-0.5 mr-3 ml-3 inline-block aspect-square w-6 text-gray-400" />
              {t(title)}
            </a>
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
