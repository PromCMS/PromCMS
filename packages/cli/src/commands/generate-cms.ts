import { Command, GlobalOptions, Options } from '@boost/cli';
import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import crypto from 'crypto';

import {
  generateByTemplates,
  loggedJobWorker,
  logSuccess,
  getWorkerJob,
  getFilenameBase,
} from '@utils';
import { PROJECT_ROOT, SUPPORTED_PACKAGE_MANAGERS } from '@constants';
import generateCore from '@parts/generate-core-files';
import { installPHPDeps } from '@parts/install-php-deps';
import { generateProjectModule } from '@parts/generate-project-module';
import { getGeneratorConfigData } from '../utils/getGeneratorConfigData.js';
import { GENERATOR_FILENAME } from '@prom-cms/shared/generator';
import rimraf from 'rimraf';
import { getInstallNodeDepsJob } from '../jobs/getInstallNodeDepsJob.js';
import { getCreatePackageJsonJob } from '../jobs/getCreatePackageJsonJob.js';
import { SupportedPackageManagers } from '@custom-types';

type CustomParams = [string];

const generatorFilenameBase = getFilenameBase(GENERATOR_FILENAME);

interface CustomOptions extends GlobalOptions {
  regenerate: boolean;
  skip: string;
  packageManager: SupportedPackageManagers;
}

export class GenerateCMSProgram extends Command {
  static path: string = 'generate-cms';
  static description: string = 'Controls a cms generator';

  // FLAGS
  configPath: string;
  regenerate: boolean = false;
  skip: string = '';
  packageManager: SupportedPackageManagers | undefined;

  static options: Options<CustomOptions> = {
    regenerate: {
      type: 'boolean',
      description: 'To regenerate entire project',
      short: 'r',
    },
    skip: {
      type: 'string',
      description: 'To specify which steps to skip',
      short: 's',
    },
    packageManager: {
      type: 'string',
      description: 'To specify which package manager use',
      short: 'p',
      choices: [...(SUPPORTED_PACKAGE_MANAGERS as any)],
    },
  };

  async run() {
    logSuccess.apply(this, [
      '🙇‍♂️ Hello, PROM developer! Sit back a few seconds while we prepare everything for you...',
    ]);

    const FINAL_PATH = process.cwd();
    const shouldSkip = this.skip.split(',');

    if (
      fs
        .readdirSync(FINAL_PATH)
        .findIndex((item) => item.startsWith(generatorFilenameBase)) == -1
    ) {
      throw new Error(
        `⛔️ Current directory "${FINAL_PATH}" has no prom config.`
      );
    }

    const generatorConfig = await getGeneratorConfigData(FINAL_PATH);
    const { project } = generatorConfig;
    const ADMIN_ROOT = path.join(PROJECT_ROOT, 'packages', 'admin');
    const exportModulesRoot = path.join(FINAL_PATH, 'modules');

    const jobs = [
      getWorkerJob('Cleanup', {
        skip: !this.regenerate,
        async job() {
          await new Promise((resolve, reject) =>
            rimraf(`./**/!(${generatorFilenameBase}.*|.env)`, (error) => {
              if (error) {
                reject(error);
              }

              resolve(undefined);
            })
          );
        },
      }),
      getCreatePackageJsonJob('Ensure package.json', {
        cwd: FINAL_PATH,
        project,
      }),
      getWorkerJob('Generate new core', {
        job: async () => {
          await generateCore(FINAL_PATH);
        },
      }),
      getWorkerJob('Add another project resources', {
        async job() {
          await generateByTemplates('commands.generate-cms', FINAL_PATH, {
            '*': {
              project: {
                ...project,
                security: {
                  ...(project.security || {}),
                  secret:
                    project.security?.secret ||
                    crypto.randomBytes(20).toString('hex'),
                },
              },
            },
          });
        },
      }),
      getWorkerJob('Install PHP dependencies', {
        skip: shouldSkip.includes('dependency-install'),
        async job() {
          await installPHPDeps(FINAL_PATH);
        },
      }),
      getWorkerJob('Generate project module', {
        async job() {
          await generateProjectModule(exportModulesRoot, generatorConfig);
        },
      }),
      getWorkerJob('Add admin html', {
        skip: shouldSkip.includes('admin'),
        async job() {
          // Build first
          await execa('npm', ['run', 'build:admin'], {
            cwd: PROJECT_ROOT,
          });

          // And the copy
          const adminFinalPath = path.join(FINAL_PATH, 'public', 'admin');

          await fs.ensureDir(adminFinalPath);
          await fs.emptyDir(adminFinalPath);

          fs.copy(
            path.join(ADMIN_ROOT, 'dist'),
            path.join(FINAL_PATH, 'public', 'admin'),
            {
              recursive: true,
              overwrite: true,
            }
          );
        },
      }),
      getInstallNodeDepsJob('Install NODE dependencies', {
        packageManager: this.packageManager,
        cwd: FINAL_PATH,
        skip: shouldSkip.includes('dependency-install'),
      }),
    ];

    await loggedJobWorker.apply(this, [jobs]);
  }
}
