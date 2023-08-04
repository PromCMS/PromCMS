import chalk from 'chalk';

export class Logger {
  static getInfoMessage(text: any, icon = 'ℹ️') {
    return `${icon ? `${icon} - ` : ''}${chalk.blueBright(text)}`;
  }

  static getSuccessMessage(text: any, icon = '✅') {
    return `${icon ? `${icon} - ` : ''}${chalk.bold.greenBright(text)}`;
  }

  static getErrorMessage(text: any, icon = '⛔️') {
    return `${icon ? `${icon} - ` : ''}${chalk.bold.redBright(text)}`;
  }

  static info(text: any) {
    console.log(this.getInfoMessage(text));
  }

  static success(text: any, icon?: string) {
    console.log(this.getSuccessMessage(text, icon));
  }

  static error(text: any, icon?: string) {
    console.log(this.getErrorMessage(text, icon));
  }
}
