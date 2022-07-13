import { Arg, Command, Config } from '@boost/cli';
import { getEnvFilepath, findGeneratorConfig } from '@prom-cms/shared';
import fs from 'fs-extra';
import path from 'path';
import { loggedJobWorker, LoggedWorkerJob, Logger } from '../../utils';
import syncDatabase from '../../parts/sync-database';
import { generateCoreModule } from '../../parts/generate-core-module';
import { formatGeneratorConfig } from '@prom-cms/shared';
import { PROJECT_ROOT, CORE_ROOT } from '../../constants';

@Config('generate:develop', 'Controls a develop cms generator', {})
export class GenerateDevelopProgram extends Command {
  @Arg.Flag('To just only regenerate key files', {
    short: 'o',
  })
  regenerate: boolean = false;

  async run() {
    Logger.success(
      '🙇‍♂️ Hello, PROM developer! Sit back a few seconds while we prepare everything for you...'
    );

    const GENERATOR_CONFIG = await findGeneratorConfig();
    const envFilepath = await getEnvFilepath();
    const { DB_CONNECTION } = process.env as unknown as {
      DB_CONNECTION: string;
    };

    if (!GENERATOR_CONFIG)
      throw '⛔️ No generator config provided, please provide a config.';
    if (DB_CONNECTION !== 'sqlite')
      throw '⛔️ At the moment we dont provide a way to seed database other than SQLITE.';

    const DEV_API_ROOT = path.join(PROJECT_ROOT, 'packages', 'dev-api');
    const CORE_MODULES_ROOT = path.join(CORE_ROOT, 'modules');
    const DEV_API_MODULES_ROOT = path.join(DEV_API_ROOT, '.temp', 'modules');
    const { database: databaseConfig } = await formatGeneratorConfig(
      GENERATOR_CONFIG
    );

    const jobs: LoggedWorkerJob[] = [
      {
        title: 'Generate development module into core',
        async job() {
          await generateCoreModule(DEV_API_MODULES_ROOT, databaseConfig.models);
        },
      },
      {
        title: 'Make symlink of development module into core as a module',
        skip: this.regenerate,
        async job() {
          const modules = fs.readdirSync(DEV_API_MODULES_ROOT);
          for (const moduleName of modules) {
            const symlinkedRoot = path.join(CORE_MODULES_ROOT, moduleName);

            if (await fs.pathExists(symlinkedRoot)) {
              await fs.remove(symlinkedRoot);
            }

            await fs.createSymlink(
              path.join(DEV_API_MODULES_ROOT, moduleName),
              symlinkedRoot,
              'dir'
            );
          }
        },
      },
      {
        title: 'Make symlink of .env variable file from project root',
        skip: this.regenerate,
        async job() {
          const CORE_ENV_PATH = path.join(CORE_ROOT, '.env');
          if (await fs.pathExists(CORE_ENV_PATH)) {
            await fs.remove(CORE_ENV_PATH);
          }
          await fs.createSymlink(envFilepath, CORE_ENV_PATH, 'file');
        },
      },
      {
        title: 'Sync database',
        skip: this.regenerate,
        job: syncDatabase,
      },
    ];

    await loggedJobWorker(jobs);

    Logger.success('✅ Everything done and ready! Bye.');
  }
}
