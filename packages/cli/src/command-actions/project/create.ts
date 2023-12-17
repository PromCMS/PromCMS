import { PACKAGE_ROOT, SUPPORTED_PACKAGE_MANAGERS } from '@constants';
import { createAdminFiles } from '@jobs/create-admin-files.js';
import { createProjectModule } from '@jobs/create-project-module.js';
import generateModels from '@jobs/generate-models.js';
import { installNodeJsDeps } from '@jobs/install-node-deps.js';
import { installPHPDeps } from '@jobs/install-php-deps.js';
import { Logger, generateByTemplates, isDirEmpty } from '@utils';
import { createPromptWithOverrides } from '@utils/createPromptWithOverrides.js';
import { getGeneratorConfigData } from '@utils/getGeneratorConfigData.js';
import { runWithProgress } from '@utils/runWithProgress.js';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import slugify from 'slugify';

import { createPromConfigPath, mockedGeneratorConfig } from '@prom-cms/schema';

type Options = {
  packageManager: (typeof SUPPORTED_PACKAGE_MANAGERS)[number];
  cwd: string;
  name: string;
  admin: boolean;
  clean?: boolean;
  install: boolean;
  /**
   * Hidden option that is for doing special login inside prom monorepo
   */
  promDevelop?: boolean;
};

export const createProjectAction = async (
  optionsFromParameters: Partial<Options>
) => {
  const { cwd, packageManager, name, admin, promDevelop, clean, install } =
    await createPromptWithOverrides(
      [
        {
          name: 'packageManager',
          type: 'list',
          message: 'Select your preferred Node.js package manager',
          choices: SUPPORTED_PACKAGE_MANAGERS,
        },
        {
          name: 'name',
          type: 'input',
          message: 'Your project name',
          transformer: (value = '') => value.trim(),
          validate(input = '') {
            return input && input.trim().length > 2
              ? true
              : 'At least two characters';
          },
        },
      ],
      optionsFromParameters
    );

  if ((await fs.pathExists(cwd)) && (await isDirEmpty(cwd)) == false) {
    if (clean) {
      await runWithProgress(fs.emptyDir(cwd), 'Cleaning cwd');
    } else {
      throw new Error(`⛔️ Final directory "${cwd}" is not empty`);
    }
  }

  const tempBuildFolder = path.join(PACKAGE_ROOT, '.temp');

  await fs.ensureDir(tempBuildFolder);
  await fs.emptyDir(tempBuildFolder);

  if (promDevelop) {
    const { default: findConfig } = await import('find-config');
    const dotenvFilepath = findConfig('.env') ?? '.env';
    const dotenvFinalFilepath = path.join(tempBuildFolder, '.env');

    if (await fs.pathExists(dotenvFilepath)) {
      await runWithProgress(
        fs.createSymlink(dotenvFilepath, dotenvFinalFilepath, 'file'),
        'Make symlink of .env variable file from project root'
      );
    } else {
      throw new Error('No .env found');
    }
  }

  await runWithProgress(
    generateByTemplates('command-actions.project.create', tempBuildFolder, {
      '*': {
        project: {
          name,
          root: tempBuildFolder,
          slug: slugify.default(name, { lower: true, trim: true }),
          security: {
            secret: crypto.randomBytes(20).toString('hex'),
          },
        },
      },
    }),
    'Scaffolding project'
  );

  if (promDevelop) {
    await fs.writeJSON(
      path.join(tempBuildFolder, createPromConfigPath('json')),
      mockedGeneratorConfig
    );
  }

  // Now we get project config event though it's still the default one
  const generatorConfig = await getGeneratorConfigData(tempBuildFolder);

  if (install) {
    await runWithProgress(
      installNodeJsDeps({ cwd: tempBuildFolder, packageManager }),
      `Calling ${packageManager} to install Node.js deps`
    );

    await runWithProgress(
      installPHPDeps({ cwd: tempBuildFolder }),
      'Calling composer to install PHP deps'
    );
  }

  const { createdAt: moduleCreatedAt } = await runWithProgress(
    createProjectModule({ cwd: tempBuildFolder, config: generatorConfig }),
    'Add default module'
  );

  Logger.info(`Module created at ${moduleCreatedAt}`);

  const generateModelsOptions = {
    moduleRoot: moduleCreatedAt,
    config: generatorConfig,
  };
  await runWithProgress(
    generateModels({ ...generateModelsOptions, appRoot: tempBuildFolder }),
    'Add default models, if any'
  );

  if (admin) {
    await runWithProgress(
      createAdminFiles({ cwd: tempBuildFolder }),
      'Add admin dashboard'
    );
  }

  await runWithProgress(
    fs.move(tempBuildFolder, cwd, { overwrite: true }),
    'Writing files'
  );

  Logger.success('Your project is ready!', '🎉');
};
