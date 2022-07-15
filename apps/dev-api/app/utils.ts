import chalk from 'chalk';

export class Logger {
  static error(message: any) {
    console.log(chalk.red.bold(message));
  }

  static info(message: any) {
    console.log(chalk.blue.bold(message));
  }

  static success(message: any) {
    console.log(chalk.green.bold(message));
  }
}
