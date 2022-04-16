import { useNotifications } from '@mantine/notifications'
import { ApiResultItem } from '@prom-cms/shared'
import { UserService } from '@services'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { getObjectDiff } from '@utils'
import { useData } from './context'

export const useOnSubmitCallback = () => {
  const { push } = useRouter()
  const { view, user } = useData()
  const notifications = useNotifications()
  const { t } = useTranslation()

  const callback = async (values) => {
    const id = notifications.showNotification({
      id:
        view === 'update'
          ? 'update-user-notification'
          : 'create-user-notification',
      loading: true,
      title: view === 'update' ? 'Updating' : 'Creating',
      message: t(
        view === 'update'
          ? 'Updating user data, please wait'
          : 'Creating new user, please wait'
      ),
      autoClose: false,
      disallowClose: true,
    })

    if (view === 'update') {
      const result = await UserService.update(
        user?.id as number,
        getObjectDiff(user, values) as ApiResultItem
      ).catch(() => {
        notifications.updateNotification(id, {
          color: 'red',
          message: t('An error happened'),
          autoClose: 2000,
        })
      })

      notifications.updateNotification(id, {
        message: t('User data has been updated!'),
        autoClose: 2000,
      })
    } else if (view === 'create') {
      const result = await UserService.create(
        getObjectDiff(user || {}, values) as ApiResultItem
      ).catch(() => {
        notifications.updateNotification(id, {
          color: 'red',
          message: t('An error happened'),
          autoClose: 2000,
        })
      })

      if (result?.data) {
        push(UserService.getListUrl())

        notifications.updateNotification(id, {
          message: t('New user has been created!'),
          autoClose: 2000,
        })
      }
    }
  }

  return callback
}
