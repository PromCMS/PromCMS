import { Logger, tryFindGeneratorConfig } from '@utils';
import child_process from 'child_process';
import path from 'path';
import { SCRIPTS_ROOT } from '@constants';

type Options = {
  cwd: string;
};

export const seedDatabaseAction = async ({ cwd }: Options) => {
  tryFindGeneratorConfig(cwd);

  Logger.info(`Running PromCMS seeding on app in "${cwd}"...`);
  let messages = '';

  try {
    await new Promise((resolve, reject) => {
      const child = child_process.exec(
        `php ${path.join(
          SCRIPTS_ROOT,
          'php',
          'commands',
          'seed-database.php'
        )} "${cwd}"`
      );

      child.stdout?.on('data', (data) => {
        messages += data;
        console.log(data);
      });

      child.on('exit', function (code) {
        if (code === 0) {
          resolve(true);
        } else {
          reject(messages);
        }
      });
    });
  } catch (error) {
    throw `⛔️ An error happened during database seeding(from php script): \n${
      (error as Error).message
    }`;
  }

  Logger.success('Seeding done!');
};
