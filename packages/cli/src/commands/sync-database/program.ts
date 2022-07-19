import { Command, Params } from '@boost/cli';
import {
  getAppRootInputValidator,
  Logger,
  pathInputToRelative,
} from '../../utils/index.js';
import child_process from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type CustomParams = [string];

export class SyncDatabaseProgram extends Command {
  static path: string = 'sync-database';
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
    Logger.info('🔃 Starting database sync and syncing...');

    let messages = '';

    try {
      await new Promise((resolve, reject) => {
        const child = child_process.exec(
          `php ${path.join(__dirname, 'sync-database.php')} "${root}"`
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
      throw `⛔️ An error happened during database syncing(from php script): \n${
        (error as Error).message
      }`;
    }

    Logger.success('✅ Sync done!');
  }
}
