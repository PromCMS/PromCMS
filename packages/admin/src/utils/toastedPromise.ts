import { MESSAGES } from '@constants';
import { notifications } from '@mantine/notifications';
import { t as importedT } from 'i18next';

export interface NotificationConfig {
  message: string;
  title: string;
  successMessage?: string;
  errorMessage?: string | ((e: unknown) => string);
  t?: typeof importedT;
}

const autocloseInterval = 4000;

export const toastedPromise = async <T extends () => Promise<any>>(
  config: NotificationConfig,
  fc: T
) => {
  const { t = importedT } = config;
  const id = notifications.show({
    loading: true,
    title: config.title,
    message: config.message,
    autoClose: false,
  });

  try {
    const fcRes = await fc();

    notifications.update({
      id,
      loading: false,
      title:
        config.successMessage ||
        t(MESSAGES.PROMISE_FINISHED_MESSAGE_DEFAULT).toString(),
      message: '',
      autoClose: autocloseInterval,
    });

    return fcRes;
  } catch (e) {
    notifications.update({
      id,
      loading: false,
      color: 'red',
      title: config.errorMessage
        ? typeof config.errorMessage === 'function'
          ? config.errorMessage(e)
          : config.errorMessage
        : t(MESSAGES.ERROR_BASIC).toString(),
      message: '',
      autoClose: autocloseInterval,
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
