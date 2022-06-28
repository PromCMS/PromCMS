import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import { setTimeout } from 'timers/promises';

export class Logger {
  static info(text: any) {
    console.log(chalk.bold.blue(text));
  }

  static success(text: any) {
    console.log(chalk.bold.green(text));
  }
}

const workingText = (text: any) =>
  chalkAnimation.rainbow(`${text}... Working!`);
const doneText = (text: any) =>
  Logger.info(`${text}... ${chalk.bold.green('Done!')}`);

export const removePrevLine = () => {
  if (!process.stdout?.moveCursor || !process.stdout?.clearLine) {
    return;
  }
  process.stdout?.moveCursor(0, -1); // up one line
  process.stdout?.clearLine(1);
};

export type LoggedWorkerJob = {
  title: string;
  job: () => Promise<void>;
  skip?: boolean;
};

export const loggedJobWorker = async (jobs: LoggedWorkerJob[]) => {
  for (const { job, title, skip } of jobs) {
    if (skip) {
      continue;
    }
    const animation = workingText(title);
    await job();
    // Wait for safe logging
    // FIXME: We have to think about different way to remove last line from cli to speed up process
    await setTimeout(200);
    animation.stop();
    removePrevLine();
    doneText(title);
  }
};
