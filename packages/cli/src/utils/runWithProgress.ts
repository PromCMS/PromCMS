import logUpdate from 'log-update';
import { Logger } from './logger.js';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export const runWithProgress = async <T extends Promise<any>>(
  promise: T,
  message: string
): Promise<Awaited<T>> => {
  let index = 0;

  // start progress
  const interval = setInterval(() => {
    const frame = FRAMES[(index = ++index % FRAMES.length)];

    logUpdate(Logger.getInfoMessage(message, frame));
  }, 80);

  const result = await Promise.resolve(promise);

  // stop progress
  clearInterval(interval);

  logUpdate(Logger.getSuccessMessage(message));

  return result;
};
