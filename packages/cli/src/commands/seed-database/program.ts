import { Command, Config } from '@boost/cli';
import { findGeneratorConfig } from '@prom-cms/shared';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { Logger } from '../../utils';
import child_process from 'child_process';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dayjs.extend(utc);
dayjs.extend(timezone);

type CustomParams = [string];

const __dirname = dirname(fileURLToPath(import.meta.url));

@Config('seed-database', 'Sync database with provided config', {})
export class SeedDatabaseProgram extends Command {
  /*@Arg.Params<CustomParams>({
    label: 'root',
    description: 'Root of your final project',
    required: true,
    type: 'string',

    validate(value) {
      if (
        !/^((\.)|((\.|\.\.)\/((?!\/).*(\/)?){1,})|((?!\/).*(\/)))$/g.test(value)
      ) {
        throw new Error(
          'Folder path must be valid path, eq: ".", "../somefolder", "./somefolder"'
        );
      }

      const referenceFolder = path.join(PROJECT_ROOT, value);

      if (
        fs.existsSync(referenceFolder) &&
        fs.lstatSync(referenceFolder).isFile()
      ) {
        throw new Error('Root folder cannot be file');
      }
    },
  })
  async run(root) {*/
  async run() {
    // TODO make this script php first and take advantage of eloquent
    Logger.info('🔃 Starting the database seeder...');

    // const PROVIDED_ROOT = path.join(PROJECT_ROOT, ...root.split('/'));
    // await loadRootEnv(PROVIDED_ROOT);

    //const GENERATOR_CONFIG = await findGeneratorConfig(PROVIDED_ROOT);
    const GENERATOR_CONFIG = await findGeneratorConfig();
    let messages = '';

    if (!GENERATOR_CONFIG) {
      throw '⛔️ No generator config provided, please provide a config.';
    }

    try {
      await new Promise((resolve, reject) => {
        const child = child_process.exec(
          `php ${path.join(__dirname, 'seed-database.php')}`
        );

        child.stdout?.on('data', (data) => {
          messages += data;
        });

        child.on('exit', function (code) {
          if (code === 0) {
            resolve(true);
          } else {
            throw new Error(
              `⛔️ An error happened during database seeding(from php script): \n${messages}`
            );
          }
        });
      });
    } catch (error) {
      throw `⛔️ An error happened during database seeding(from php script): \n${messages}`;
    }

    Logger.success('✅ Seeding done!');
  }
}
