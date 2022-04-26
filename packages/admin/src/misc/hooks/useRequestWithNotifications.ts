import { useId } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'

export interface NotificationConfig {
  message: string
  title: string
  successMessage?: string
  errorMessage?: string | ((e: unknown) => string)
}
const autocloseInterval = 4000
export const useRequestWithNotifications = () => {
  const notifications = useNotifications()
  const notifId = useId()
  const { t } = useTranslation()

  return async <T extends () => Promise<any>>(
    config: NotificationConfig,
    fc: T
  ) => {
    const notificationId = notifications.showNotification({
      id: notifId,
      loading: true,
      title: config.title,
      message: config.message,
      autoClose: false,
      disallowClose: true,
    })

    try {
      const fcRes = await fc()

      notifications.updateNotification(notificationId, {
        message: config.successMessage || t('Task completed successfully'),
        autoClose: autocloseInterval,
      })

      return fcRes
    } catch (e) {
      notifications.updateNotification(notificationId, {
        color: 'red',
        message: config.errorMessage
          ? typeof config.errorMessage === 'function'
            ? config.errorMessage(e)
            : config.errorMessage
          : t('An error happened'),
        autoClose: autocloseInterval,
      })
      throw e
    }
  }
}
