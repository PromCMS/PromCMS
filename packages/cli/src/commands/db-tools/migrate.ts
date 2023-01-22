import { Command, GlobalOptions, Options, Params } from '@boost/cli';
import path from 'path';
import child_process from 'child_process';
import { Logger, pathInputToRelative } from '@utils';
import fs from 'fs-extra';

import { SCRIPTS_ROOT } from '@constants';

type CustomParams = [string];

interface CustomOptions extends GlobalOptions {
  empty: boolean;
}

export class DbToolsMigrateProgram extends Command {
  static path: string = 'db-tools:migrate';
  static description: string = 'Migrate all of your data from other databases';

  // FLAGS
  empty: boolean = true;
  static options: Options<CustomOptions> = {
    empty: {
      type: 'boolean',
      description: 'To first remove old data',
      short: 'e',
    },
  };

  static params: Params<CustomParams> = [
    {
      label: 'Data file',
      description: 'Path to a json file that contains all of your data',
      required: true,
      type: 'string',
      validate: (value) => {
        if (!fs.pathExistsSync(value)) {
          throw new Error(`Path to a file "${value}" does not exists`);
        }

        if (!value.endsWith('.json')) {
          throw new Error('Must be a json file');
        }
      },
      format: pathInputToRelative,
    },
  ];

  async run(dataFilePath: string) {
    Logger.info('🔃 Starting the database migrator...');
    let messages = '';

    try {
      const root = process.cwd();

      await new Promise((resolve, reject) => {
        const child = child_process.exec(
          `php ${path.join(
            SCRIPTS_ROOT,
            'php',
            'commands',
            'db-tools',
            'migrate.php'
          )} "${root}" "${dataFilePath}"`
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
  }
}
