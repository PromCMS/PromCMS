import { Command, GlobalOptions, Options } from '@boost/cli';
import { Input, Select } from '@boost/cli/react';
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
} from '../utils';
import { PROJECT_ROOT, TEMPLATES_ROOT } from '../constants';
import generateCore from '../parts/generate-core-files';
import { installPHPDeps } from '../parts/install-php-deps';
import { generateProjectModule } from '../parts/generate-project-module';
import { getGeneratorConfigData } from '../utils/getGeneratorConfigData';
import { GENERATOR_FILENAME } from '@prom-cms/shared';

type CustomParams = [string];

const generatorFilenameBase = getFilenameBase(GENERATOR_FILENAME);

const simplifyProjectName = (name: string) =>
  name.replaceAll(' ', '-').toLocaleLowerCase();

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
    const projectNameSimplified = simplifyProjectName(project.name);
    const ADMIN_ROOT = path.join(PROJECT_ROOT, 'apps', 'admin');

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
          const rimrafExecutable = path.resolve(
            PROJECT_ROOT,
            'node_modules',
            'rimraf',
            'bin.js'
          );

          await execa(
            `npx ${rimrafExecutable} **/!(${generatorFilenameBase}.*|.env)`,
            {
              cwd: PROJECT_ROOT,
            }
          );
        },
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
          await generateByTemplates(
            path.join(TEMPLATES_ROOT, 'commands', 'generate-cms'),
            FINAL_PATH,
            {
              '*': {
                project: {
                  ...project,
                  name: projectNameSimplified,
                  security: {
                    ...(project.security || {}),
                    secret:
                      project.security?.secret ||
                      crypto.randomBytes(20).toString('hex'),
                  },
                },
              },
            }
          );
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
      getWorkerJob<{ packageManager: string }>('Install dependencies', {
        skip: this.regenerate,
        prompts: [
          [
            'packageManager',
            {
              type: Select,
              props: {
                label: 'What package manager should this project use?',
                options: ['yarn', 'npm', 'pnpm'],
              },
            },
          ],
        ],
        async job({ packageManager } = { packageManager: 'npm' }) {
          const devDeps = [
            'prettier-plugin-twig-melody',
            '@prettier/plugin-php',
            '@prom-cms/vite-plugin',
            'vite',
            'vite-plugin-live-reload',
            'typescript',
          ];
          // const deps = [];

          await execa(packageManager, ['install', ...devDeps, '--save-dev'], {
            cwd: FINAL_PATH,
          });
        },
      }),
    ];

    await loggedJobWorker.apply(this, [jobs]);
  }
}
