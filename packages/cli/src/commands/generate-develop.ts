import { Command, GlobalOptions, Options } from '@boost/cli';
import { getEnvFilepath, validateGeneratorConfig } from '@prom-cms/shared';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { formatGeneratorConfig } from '@prom-cms/shared';
import { developmentPHPAppPath } from '@prom-cms/shared/internal';

import { mockedGeneratorConfig, PROJECT_ROOT } from '../constants.js';
import {
  generateByTemplates,
  getWorkerJob,
  isDirEmpty,
  loggedJobWorker,
  logSuccess,
} from '@utils';
import { LoggedWorkerJob } from '@custom-types';
import generateCore from '../parts/generate-core-files.js';
import { installPHPDeps } from '../parts/install-php-deps.js';
import { generateProjectModule } from '../parts/generate-project-module.js';
import { getInstallNodeDepsJob } from '../jobs/getInstallNodeDepsJob.js';
import { getCreatePackageJsonJob } from '../jobs/getCreatePackageJsonJob.js';

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
      description: 'Recreates project from ground up',
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
    const finalEnvFilePath = path.join(developmentPHPAppPath, '.env');
    const modulesRoot = path.join(developmentPHPAppPath, 'modules');

    const generatorConfig = await validateGeneratorConfig(
      await formatGeneratorConfig(mockedGeneratorConfig)
    );
    const { project } = generatorConfig;

    const jobs: LoggedWorkerJob[] = [
      getWorkerJob('Delete old project', {
        skip: !this.regenerate,
        job: async () => {
          await fs.remove(developmentPHPAppPath);
        },
      }),
      getWorkerJob('Ensure project root', {
        skip: await fs.pathExists(developmentPHPAppPath),
        job: async () => {
          await fs.ensureDir(developmentPHPAppPath);
        },
      }),
      getCreatePackageJsonJob('Ensure package.json', {
        cwd: developmentPHPAppPath,
        project,
      }),
      getWorkerJob('Add project base resources', {
        async job() {
          await generateByTemplates(
            'commands.generate-cms',
            developmentPHPAppPath,
            {
              '*': {
                project: {
                  ...project,
                  security: {
                    ...(project.security || {}),
                    secret: crypto.randomBytes(20).toString('hex'),
                  },
                },
              },
            },
            {
              filter: (fileName) =>
                fileName !== '.env' &&
                fileName !== '.tsconfig.json' &&
                fileName !== 'vite.config.ts',
            }
          );
        },
      }),
      getWorkerJob('Generate new core', {
        job: async () => {
          await generateCore(developmentPHPAppPath);
        },
      }),
      getWorkerJob('Install PHP deps', {
        // No need to install again when deps are present
        skip:
          (await isDirEmpty(path.join(developmentPHPAppPath, 'vendor'))) ===
          false,
        async job() {
          await installPHPDeps(developmentPHPAppPath);
        },
      }),
      // TODO: make some use of this
      // getInstallNodeDepsJob('Install dependencies', {
      //   cwd: developmentPHPAppPath,
      //   regenerate: this.regenerate,
      //   packageManager: 'npm',
      // }),
      getWorkerJob('Generate project module', {
        async job() {
          await generateProjectModule(modulesRoot, generatorConfig);
        },
      }),
      getWorkerJob('Make symlink of .env variable file from project root', {
        skip: await fs.pathExists(finalEnvFilePath),
        async job() {
          await fs.createSymlink(envFilepath, finalEnvFilePath, 'file');
        },
      }),
      // TODO: Run seeder here via execa
    ];

    await loggedJobWorker.apply(this, [jobs]);

    logSuccess.apply(this, ['✅ Everything done and ready! Bye.']);
  }
}
