import { MESSAGES } from '@constants';
import { showNotification, updateNotification } from '@mantine/notifications';
import { t } from 'i18next';

import { generateUuid } from './data';

export interface NotificationConfig {
  message: string;
  title: string;
  successMessage?: string;
  errorMessage?: string | ((e: unknown) => string);
}

const autocloseInterval = 4000;

export const toastedPromise = async <T extends () => Promise<any>>(
  config: NotificationConfig,
  fc: T
) => {
  const id = generateUuid();

  showNotification({
    id,
    loading: true,
    title: config.title,
    message: config.message,
    autoClose: false,
    disallowClose: true,
  });

  try {
    const fcRes = await fc();

    updateNotification({
      id,
      message:
        config.successMessage ||
        t(MESSAGES.PROMISE_FINISHED_MESSAGE_DEFAULT).toString(),
      autoClose: autocloseInterval,
    });

    return fcRes;
  } catch (e) {
    updateNotification({
      id,
      color: 'red',
      message: config.errorMessage
        ? typeof config.errorMessage === 'function'
          ? config.errorMessage(e)
          : config.errorMessage
        : t(MESSAGES.ERROR_BASIC).toString(),
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
