import { Command, GlobalOptions, Options } from '@boost/cli';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import {
  developmentPHPAppPath,
  mockedGeneratorConfig,
} from '@prom-cms/shared/internal';

import {
  generateByTemplates,
  getEnvFilepath,
  getModuleFolderName,
  getWorkerJob,
  isDirEmpty,
  loggedJobWorker,
  logSuccess,
} from '@utils';
import { LoggedWorkerJob } from '@custom-types';
import generateCore from '../parts/generate-core-files.js';
import { installPHPDeps } from '../parts/install-php-deps.js';
import { generateProjectModule } from '../parts/generate-project-module.js';
import { getCreatePackageJsonJob } from '../jobs/getCreatePackageJsonJob.js';
import {
  formatGeneratorConfig,
  validateGeneratorConfig,
} from '@prom-cms/shared/generator';
import generateModels from '@parts/generate-models';

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
      getWorkerJob('Generate new core', {
        job: async () => {
          await generateCore(developmentPHPAppPath);
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
      getWorkerJob('Install PHP deps', {
        // No need to install again when deps are present
        skip:
          (await isDirEmpty(path.join(developmentPHPAppPath, 'vendor'))) ===
          false,
        async job() {
          await installPHPDeps(developmentPHPAppPath);
        },
      }),
      getWorkerJob('Generate project module', {
        async job() {
          await generateProjectModule(modulesRoot, generatorConfig);
          const moduleName = getModuleFolderName(generatorConfig.project.name);

          await generateModels(
            path.join(modulesRoot, moduleName),
            generatorConfig.database
          );
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
