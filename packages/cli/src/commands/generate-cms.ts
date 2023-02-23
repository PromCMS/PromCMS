import { Command, GlobalOptions, Options } from '@boost/cli';
import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';

import {
  generateByTemplates,
  loggedJobWorker,
  logSuccess,
  getWorkerJob,
  getFilenameBase,
  getModuleFolderName,
} from '@utils';
import { PACKAGE_ROOT, SUPPORTED_PACKAGE_MANAGERS } from '@constants';
import generateCore from '@parts/generate-core-files';
import { generateProjectModule } from '@parts/generate-project-module';
import { getGeneratorConfigData } from '../utils/getGeneratorConfigData.js';
import { GENERATOR_FILENAME } from '@prom-cms/shared/generator';
import rimraf from 'rimraf';
import { getInstallNodeDepsJob } from '../jobs/getInstallNodeDepsJob.js';
import { getCreatePackageJsonJob } from '../jobs/getCreatePackageJsonJob.js';
import { getCreateComposerJsonJob } from '../jobs/getCreateComposerJsonJob.js';
import { SupportedPackageManagers } from '@custom-types';
import generateModels from '@parts/generate-models';

const generatorFilenameBase = getFilenameBase(GENERATOR_FILENAME);
const steps = [
  'cleanup',
  'package-json',
  'admin',
  'resources',
  'module',
  'models',
  'composer-json',
] as const;
const allowedSkipArguments = [
  ...steps,
  '*',
  ...(steps.map((item) => `!${item}`) as `!${typeof steps[number]}`[]),
] as const;
type AllowedSkipArgument =
  typeof allowedSkipArguments[keyof typeof allowedSkipArguments];
type AllowedSkipArguments = AllowedSkipArgument[];

const normalizeIgnoreSteps = (shouldSkip: AllowedSkipArguments) => {
  let result = new Set<AllowedSkipArgument>();

  if (shouldSkip.includes('*')) {
    for (const step of steps) {
      result.add(step);
    }
  }

  const includeSteps = shouldSkip.filter((item) => `${item}`.startsWith('!'));
  const excludeSteps = shouldSkip.filter(
    (item) => !`${item}`.startsWith('!') && item !== '*'
  );

  for (const excludeStep of excludeSteps) {
    result.add(excludeStep);
  }

  for (const includeStep of includeSteps) {
    result.delete((includeStep as string).replace('!', '') as any);
  }

  return Array.from(result);
};

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
      validate(value) {
        const unknownSteps: string[] = [];

        for (const stepKey of value.split(',')) {
          if (!allowedSkipArguments.includes(stepKey as any)) {
            unknownSteps.push(stepKey);
          }
        }

        if (unknownSteps.length) {
          throw new Error(
            `Unknown steps "${unknownSteps.join('", "')}" in skip argument`
          );
        }
      },
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
    const generatorConfig = await getGeneratorConfigData(FINAL_PATH);

    const { project } = generatorConfig;
    const exportModulesRoot = path.join(FINAL_PATH, 'modules');
    const moduleFolderName = getModuleFolderName(project.name);

    // Format cli arguments
    const skipArguments = normalizeIgnoreSteps(
      this.skip.split(',') as unknown as AllowedSkipArguments
    );

    const jobs = [
      // Clean up all files when regenerate is required
      ...(this.regenerate
        ? [
            getWorkerJob('Cleanup', {
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
          ]
        : []),

      getCreatePackageJsonJob('Ensure package.json', {
        cwd: FINAL_PATH,
        project,
        skip: skipArguments.includes('package-json'),
      }),
      getCreateComposerJsonJob('Ensure composer.json', {
        cwd: FINAL_PATH,
        skip: skipArguments.includes('composer-json'),
      }),
      getInstallNodeDepsJob('Install NODE dependencies', {
        packageManager: this.packageManager,
        cwd: FINAL_PATH,
        skip: skipArguments.includes('package-json'),
      }),
      getWorkerJob('Add admin html', {
        skip: skipArguments.includes('admin'),
        async job() {
          // We will just prebuild admin from package on npm
          const adminRoot = path.resolve(PACKAGE_ROOT, '..', 'admin');

          // And the copy
          const adminFinalPath = path.join(FINAL_PATH, 'public', 'admin');

          await fs.ensureDir(adminFinalPath);
          await fs.emptyDir(adminFinalPath);

          fs.copy(
            path.join(adminRoot, 'dist'),
            path.join(FINAL_PATH, 'public', 'admin'),
            {
              recursive: true,
              overwrite: true,
            }
          );
        },
      }),
      getWorkerJob('Generate project core resources', {
        skip: skipArguments.includes('resources'),
        job: async () => {
          await generateCore(FINAL_PATH);
          await generateByTemplates(
            'commands.generate-cms',
            FINAL_PATH,
            {
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
            },
            {
              // Do not override some files
              filter: (fileName) => {
                let result = true;
                const doNotOverrideFilenames = ['.env', 'tsconfig.json'];

                if (doNotOverrideFilenames.includes(fileName)) {
                  // if it exists then we wont override
                  result =
                    fs.existsSync(path.join(FINAL_PATH, fileName)) === false;
                }

                return result;
              },
            }
          );
        },
      }),
      getWorkerJob('Generate main module', {
        skip: skipArguments.includes('module'),
        async job() {
          await generateProjectModule(exportModulesRoot, generatorConfig);
        },
      }),
      getWorkerJob('Generate models into main module', {
        skip: skipArguments.includes('models'),
        async job() {
          await generateModels(
            path.join(exportModulesRoot, moduleFolderName),
            generatorConfig.database
          );
        },
      }),
    ];

    await loggedJobWorker.apply(this, [jobs]);
  }
}
