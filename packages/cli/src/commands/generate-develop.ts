import { Command, GlobalOptions, Options } from '@boost/cli';
import { getEnvFilepath } from '@prom-cms/shared';
import fs from 'fs-extra';
import path from 'path';
import { formatGeneratorConfig } from '@prom-cms/shared';

import { mockedGeneratorConfig, PROJECT_ROOT } from '../constants';
import { loggedJobWorker, logSuccess } from '../utils';
import generateCore from '../parts/generate-core-files';
import { installPHPDeps } from '../parts/install-php-deps';
import { generateProjectModule } from '../parts/generate-project-module';
import { LoggedWorkerJob } from '../types';

interface CustomOptions extends GlobalOptions {
  regenerate: boolean;
}

export class GenerateDevelopProgram extends Command {
  static path: string = 'generate:develop';
  static description: string = 'Controls a develop cms generator';

  // FLAGS
  regenerate: boolean = false;

  static options: Options<CustomOptions> = {
    regenerate: {
      description: 'To just only regenerate key files',
      type: 'boolean',
      short: 'o',
      default: false,
    },
  };

  async run() {
    logSuccess.apply(this, [
      'Hello, PROM developer! Sit back a few seconds while we prepare everything for you...',
    ]);

    const envFilepath = await getEnvFilepath();
    const DEV_API_ROOT = path.join(PROJECT_ROOT, 'apps', 'dev-api');
    const TEMP_CORE_ROOT = path.join(DEV_API_ROOT, '.temp');
    const MODULES_ROOT = path.join(TEMP_CORE_ROOT, 'modules');
    const generatorConfig = await formatGeneratorConfig(mockedGeneratorConfig);

    const jobs: LoggedWorkerJob[] = [
      {
        title: 'Remove old core',
        skip: this.regenerate,
        async job() {
          if (await fs.pathExists(TEMP_CORE_ROOT)) {
            await fs.remove(TEMP_CORE_ROOT);
          }
        },
      },
      {
        title: 'Generate new core',
        job: async () => {
          await generateCore(TEMP_CORE_ROOT);
        },
      },
      {
        title: 'Install PHP deps',
        skip: this.regenerate,
        async job() {
          await installPHPDeps(TEMP_CORE_ROOT);
        },
      },
      {
        title: 'Generate project module',
        async job() {
          await generateProjectModule(MODULES_ROOT, generatorConfig);
        },
      },
      {
        title: 'Make symlink of .env variable file from project root',
        skip: this.regenerate,
        async job() {
          const CORE_ENV_PATH = path.join(TEMP_CORE_ROOT, '.env');
          if (await fs.pathExists(CORE_ENV_PATH)) {
            await fs.remove(CORE_ENV_PATH);
          }
          await fs.createSymlink(envFilepath, CORE_ENV_PATH, 'file');
        },
      },
    ];

    await loggedJobWorker.apply(this, [jobs]);

    logSuccess.apply(this, ['✅ Everything done and ready! Bye.']);
  }
}
