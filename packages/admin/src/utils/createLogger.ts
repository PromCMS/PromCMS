import { logger } from '@logger';
import dayjs from 'dayjs';

const isEnabled = !import.meta.env.PROD;

type MessageParam = string | Record<any, any> | number | any[];

export const createLogger = (scope: string) => ({
  timeNow() {
    return dayjs().format('MM.DD.YYYY HH:mm:ss');
  },

  log(message: MessageParam) {
    if (!isEnabled) {
      logger.log('An event happened', message);

      return;
    }

    console.log(
      `%c[${scope}](${this.timeNow()}) An event happened:`,
      'background: #222; color: #bada55'
    );
    console.log(message);
  },
  error(message: MessageParam, info?: string) {
    if (!isEnabled) {
      logger.error(info, message);

      return;
    }

    console.log(
      `%c[${scope}](${this.timeNow()}) An error happened${
        info ? ` (${info})` : ''
      }:`,
      'color:#ff5757;'
    );
    console.error(message);
  },
});
