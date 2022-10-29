import { ArgList, Command, GlobalOptions } from '@boost/cli';
import chalk from 'chalk';

export class Logger {
  static info(text: any) {
    console.log(chalk.bold.blue(text));
  }

  static success(text: any) {
    console.log(chalk.bold.green(text));
  }
}

export function logSuccess<T extends Command<GlobalOptions, ArgList, {}>>(
  this: T,
  ...params: Parameters<typeof console.log>
) {
  this.log(chalk.bold.green(...params));
}

export function logInfo<T extends Command<GlobalOptions, ArgList, {}>>(
  this: T,
  ...params: Parameters<typeof console.log>
) {
  this.log(chalk.bold.blue(...params));
}

export function logError<T extends Command<GlobalOptions, ArgList, {}>>(
  this: T,
  ...params: Parameters<typeof console.log>
) {
  this.log.error(chalk.bold.blue(...params));
}

export const removePrevLine = () => {
  if (!process.stdout?.moveCursor || !process.stdout?.clearLine) {
    return;
  }
  process.stdout?.moveCursor(0, -1); // up one line
  process.stdout?.clearLine(1);
};
