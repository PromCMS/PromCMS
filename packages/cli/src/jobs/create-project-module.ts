import path from 'path';
import { generateByTemplates, getModuleFolderName } from '@utils';
import generateModule from './generate-module.js';
import { GeneratorConfig } from '@prom-cms/schema';
import { MODULE_FOLDER_NAME } from '@constants';

export type CreateProjectModuleOptions = {
  cwd: string;
  config: GeneratorConfig;
};

export const createProjectModule = async ({
  cwd,
  config,
}: CreateProjectModuleOptions) => {
  const modulesRoot = path.join(cwd, MODULE_FOLDER_NAME);
  const moduleName = getModuleFolderName(config.project.name);
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
