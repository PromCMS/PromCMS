import { Command, Params } from '@boost/cli';
import { Logger, pathInputToRelative, getAppRootInputValidator } from '@utils';
import child_process from 'child_process';
import path from 'path';
import { SCRIPTS_ROOT } from '@constants';

type CustomParams = [string];

export class SeedDatabaseProgram extends Command {
  static path: string = 'seed-database';
  static description: string = 'Sync database with provided config';

  static params: Params<CustomParams> = [
    {
      label: 'Root',
      description: 'Root of your final project',
      required: true,
      type: 'string',
      validate: getAppRootInputValidator(false),
      format: pathInputToRelative,
    },
  ];

  async run(root: string) {
    Logger.info(`🔃 Running prom-cms seeding on app in "${root}"...`);
    let messages = '';

    try {
      await new Promise((resolve, reject) => {
        const child = child_process.exec(
          `php ${path.join(
            SCRIPTS_ROOT,
            'php',
            'commands',
            'seed-database.php'
          )} "${root}"`
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

    Logger.success('✅ Seeding done!');
  }
}
