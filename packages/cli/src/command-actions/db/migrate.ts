import path from 'path';
import child_process from 'child_process';
import { Logger } from '@utils';

import { SCRIPTS_ROOT } from '@constants';

type Options = {
  cwd: string;
  file: string;
};

export const migrateDatabaseAction = async ({ cwd, file }: Options) => {
  Logger.info('Starting the database migrator...');
  let messages = '';

  try {
    await new Promise((resolve, reject) => {
      const child = child_process.exec(
        `php ${path.join(
          SCRIPTS_ROOT,
          'php',
          'commands',
          'db-tools',
          'migrate.php'
        )} "${cwd}" "${file}"`
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
    throw `⛔️ An error happened during database migration(from php script): \n${
      (error as Error).message
    }`;
  }

  Logger.success('✅ Seeding done!');
};
