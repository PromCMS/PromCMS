import { Command, GlobalOptions, Options } from '@boost/cli';
import { Input } from '@boost/cli/react';
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
import { PROJECT_ROOT } from '@constants';
import generateCore from '@parts/generate-core-files';
import { installPHPDeps } from '@parts/install-php-deps';
import { generateProjectModule } from '@parts/generate-project-module';
import { getGeneratorConfigData } from '../utils/getGeneratorConfigData.js';
import { GENERATOR_FILENAME } from '@prom-cms/shared/generator';
import rimraf from 'rimraf';
import { getInstallNodeDepsJob } from '../jobs/getInstallNodeDepsJob.js';
import { getCreatePackageJsonJob } from '../jobs/getCreatePackageJsonJob.js';

type CustomParams = [string];

const generatorFilenameBase = getFilenameBase(GENERATOR_FILENAME);

interface CustomOptions extends GlobalOptions {
  override: boolean;
  regenerate: boolean;
  admin: boolean;
}

export class GenerateCMSProgram extends Command {
  static path: string = 'generate-cms';
  static description: string = 'Controls a cms generator';

  // FLAGS
  configPath: string;
  override: boolean = false;
  regenerate: boolean = false;
  admin: boolean = true;
  static options: Options<CustomOptions> = {
    override: {
      type: 'boolean',
      description: 'To override contents of target folder',
      short: 'o',
    },
    regenerate: {
      type: 'boolean',
      description: 'To just only regenerate admin and Core',
      short: 'r',
    },
    admin: {
      type: 'boolean',
      description: 'To generate admin',
      default: true,
      short: 'a',
    },
  };

  async run() {
    logSuccess.apply(this, [
      '🙇‍♂️ Hello, PROM developer! Sit back a few seconds while we prepare everything for you...',
    ]);

    const FINAL_PATH = process.cwd();

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

    if (
      !this.override &&
      !this.regenerate &&
      fs.existsSync(FINAL_PATH) &&
      fs.readdirSync(FINAL_PATH).length > 1
    ) {
      throw new Error(
        `⛔️ Current directory "${FINAL_PATH}" has some contents already`
      );
    }

    const exportModulesRoot = path.join(FINAL_PATH, 'modules');
    const jobs = [
      getWorkerJob('Cleanup', {
        skip: this.override === false,
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
        prompts: [
          [
            'packageManager',
            {
              type: Input,
              props: {
                label: 'What package manager should this project use?',
              },
            },
          ],
        ],
        job: async () => {
          await generateCore(FINAL_PATH);
        },
      }),
      getWorkerJob('Add another project resources', {
        skip: this.regenerate,
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
        async job() {
          await installPHPDeps(FINAL_PATH);
        },
      }),
      getWorkerJob('Generate project module', {
        skip: this.regenerate,
        async job() {
          await generateProjectModule(exportModulesRoot, generatorConfig);
        },
      }),
      getWorkerJob('Add admin html', {
        skip: this.admin === false,
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
      getInstallNodeDepsJob('Install dependencies', {
        cwd: FINAL_PATH,
        regenerate: this.regenerate,
      }),
    ];

    await loggedJobWorker.apply(this, [jobs]);
  }
}
