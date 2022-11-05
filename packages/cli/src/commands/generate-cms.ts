import { Command, GlobalOptions, Options, Params } from '@boost/cli';
import { Input, Select } from '@boost/cli/react';
import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import {
  formatGeneratorConfig,
  ExportConfig,
  GENERATOR_FILENAME__JSON,
} from '@prom-cms/shared';
import crypto from 'crypto';

import {
  generateByTemplates,
  loggedJobWorker,
  pathInputToRelative,
  validateConfigPathInput,
  getAppRootInputValidator,
  logSuccess,
  getWorkerJob,
} from '../utils';
import { PROJECT_ROOT, TEMPLATES_ROOT } from '../constants';
import generateCore from '../parts/generate-core-files';
import { installPHPDeps } from '../parts/install-php-deps';
import { generateProjectModule } from '../parts/generate-project-module';

type CustomParams = [string];

const simplifyProjectName = (name: string) =>
  name.replaceAll(' ', '-').toLocaleLowerCase();

interface CustomOptions extends GlobalOptions {
  configPath: string;
  override: boolean;
  regenerate: boolean;
}

export class GenerateCMSProgram extends Command {
  static path: string = 'generate-cms';
  static description: string = 'Controls a cms generator';

  // FLAGS
  configPath: string;
  override: boolean = false;
  regenerate: boolean = false;
  static options: Options<CustomOptions> = {
    configPath: {
      type: 'string',
      description: 'To specify prom config path',
      short: 'c',
      validate: validateConfigPathInput,
    },
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
  };

  static params: Params<CustomParams> = [
    {
      label: 'Root',
      description: 'Root of your final project',
      required: true,
      type: 'string',
      validate: getAppRootInputValidator(),
      format: pathInputToRelative,
    },
  ];

  async run(root: string) {
    logSuccess.apply(this, [
      '🙇‍♂️ Hello, PROM developer! Sit back a few seconds while we prepare everything for you...',
    ]);

    // Apply formatters
    this.configPath = pathInputToRelative(this.configPath);

    const FINAL_PATH = root;
    const generatorConfig: ExportConfig = this.configPath.endsWith('.json')
      ? await fs.readJson(this.configPath)
      : (await import('file:/' + this.configPath)).default;

    const projectConfig = await formatGeneratorConfig(generatorConfig);
    const { project } = projectConfig;
    const projectNameSimplified = simplifyProjectName(project.name);
    const ADMIN_ROOT = path.join(PROJECT_ROOT, 'apps', 'admin');

    if (
      !this.override &&
      !this.regenerate &&
      fs.existsSync(FINAL_PATH) &&
      fs.readdirSync(FINAL_PATH).length !== 0
    ) {
      throw new Error(
        `⛔️ Your path to project "${FINAL_PATH}" already exists`
      );
    }

    const exportModulesRoot = path.join(FINAL_PATH, 'modules');
    const jobs = [
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
      getWorkerJob('Paste generator config to project', {
        async job() {
          await fs.writeJSON(
            path.join(FINAL_PATH, GENERATOR_FILENAME__JSON),
            generatorConfig
          );
        },
      }),
      getWorkerJob('Generate project module', {
        skip: this.regenerate,
        async job() {
          await generateProjectModule(exportModulesRoot, projectConfig);
        },
      }),
      getWorkerJob('Add admin html', {
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
