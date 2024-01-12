import { MODULE_FOLDER_NAME } from '@constants';
import { generateByTemplates } from '@utils';
import path from 'path';

import { GeneratorConfig, nameToPhpClassName } from '@prom-cms/schema';

import generateModule from './generate-module.js';

export type CreateProjectModuleOptions = {
  cwd: string;
  config: GeneratorConfig;
};

export const createProjectModule = async ({
  cwd,
  config,
}: CreateProjectModuleOptions) => {
  const modulesRoot = path.join(cwd, MODULE_FOLDER_NAME);
  const moduleName = nameToPhpClassName(config.project.name);
  const createAt = path.join(modulesRoot, moduleName);

  await generateModule(modulesRoot, moduleName);

  await generateByTemplates('parts.create-project-module', createAt, {
    '*': {
      project: config.project,
      views: {
        prefix: moduleName,
      },
    },
  });

  return {
    createdAt: createAt,
  };
};
