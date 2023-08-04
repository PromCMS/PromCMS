import fs from 'fs-extra';
import crypto from 'crypto';
import slugify from 'slugify';
import path from 'path';

import { SUPPORTED_PACKAGE_MANAGERS } from '@constants';
import { createPromptWithOverrides } from '@utils/createPromptWithOverrides.js';
import { runWithProgress } from '@utils/runWithProgress.js';
import { generateByTemplates, isDirEmpty, Logger } from '@utils';
import { installPHPDeps } from '@jobs/install-php-deps.js';
import { installNodeJsDeps } from '@jobs/install-node-deps.js';
import { createProjectModule } from '@jobs/create-project-module.js';
import { getGeneratorConfigData } from '@utils/getGeneratorConfigData.js';
import generateModels from '@jobs/generate-models.js';
import { createAdminFiles } from '@jobs/create-admin-files.js';
import { GENERATOR_FILENAME__JSON } from '@prom-cms/shared/generator';
import { mockedGeneratorConfig } from '@prom-cms/shared/internal';

type Options = {
  packageManager: typeof SUPPORTED_PACKAGE_MANAGERS[number];
  cwd: string;
  name: string;
  noAdmin?: boolean;
  promDevelop?: boolean;
  clean?: boolean;
};

export const createProjectAction = async (
  optionsFromParameters: Partial<Options>
) => {
  const { cwd, packageManager, name, noAdmin, promDevelop, clean } =
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

  if (await fs.pathExists(cwd)) {
    if ((await isDirEmpty(cwd)) == false) {
      if (clean) {
        runWithProgress(fs.emptyDir(cwd), 'Cleaning cwd');
      } else {
        throw new Error('⛔️ Final directory is not empty');
      }
    }
  } else {
    await fs.ensureDir(cwd);
  }

  if (promDevelop) {
    const { default: findConfig } = await import('find-config');
    const dotenvFilepath = findConfig('.env') ?? '.env';
    const dotenvFinalFilepath = path.join(cwd, '.env');

    if (await fs.pathExists(dotenvFilepath)) {
      runWithProgress(
        fs.createSymlink(dotenvFilepath, dotenvFinalFilepath, 'file'),
        'Make symlink of .env variable file from project root'
      );
    } else {
      throw new Error('No .env found');
    }
  }

  await runWithProgress(
    generateByTemplates('command-actions.project.create', cwd, {
      '*': {
        project: {
          name,
          slug: slugify.default(name),
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
      path.join(cwd, GENERATOR_FILENAME__JSON),
      mockedGeneratorConfig
    );
  }

  // Now we get project config event though it's still the default one
  const generatorConfig = await getGeneratorConfigData(cwd);

  await runWithProgress(
    installNodeJsDeps({ cwd, packageManager }),
    `Calling ${packageManager} to install Node.js deps`
  );

  await runWithProgress(
    installPHPDeps({ cwd }),
    'Calling composer to install PHP deps'
  );

  const { createdAt: moduleCreatedAt } = await runWithProgress(
    createProjectModule({ cwd, config: generatorConfig }),
    'Add default module'
  );

  Logger.info(`Module created at ${moduleCreatedAt}`);

  await runWithProgress(
    generateModels({ moduleRoot: moduleCreatedAt, config: generatorConfig }),
    'Add default models, if any'
  );

  if (noAdmin !== true) {
    await runWithProgress(createAdminFiles({ cwd }), 'Add admin dashboard');
  }

  Logger.success('Your project is ready!', '🎉');
};
