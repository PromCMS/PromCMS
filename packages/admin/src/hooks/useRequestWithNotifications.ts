import { MESSAGES } from '@constants';
import { useId } from '@mantine/hooks';
import { notifications, updateNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

export interface NotificationConfig {
  message: string;
  title: string;
  successMessage?: string;
  errorMessage?: string | ((e: unknown) => string);
}
const autocloseInterval = 4000;
export const useRequestWithNotifications = () => {
  const { t } = useTranslation();

  return async <T extends () => Promise<any>>(
    config: NotificationConfig,
    fc: T
  ) => {
    const id = notifications.show({
      loading: true,
      title: config.title,
      message: config.message,
      autoClose: false,
    });

    try {
      const fcRes = await fc();

      updateNotification({
        id,
        title:
          config.successMessage || t(MESSAGES.PROMISE_FINISHED_MESSAGE_DEFAULT),
        message: '',
        autoClose: autocloseInterval,
        loading: false,
      });

      return fcRes;
    } catch (e) {
      notifications.update({
        id,
        color: 'red',
        title: config.errorMessage
          ? typeof config.errorMessage === 'function'
            ? config.errorMessage(e)
            : config.errorMessage
          : t(MESSAGES.ERROR_BASIC),
        message: '',
        autoClose: autocloseInterval,
        loading: false,
      });
      if (!import.meta.env.PROD) {
        console.error({
          Message: 'an error happened during execution request notifications',
          Error: e,
        });
      }
      throw e;
    }
  };
};
