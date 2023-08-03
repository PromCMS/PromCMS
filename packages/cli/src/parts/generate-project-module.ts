import path from 'path';
import {
  generateByTemplates,
  getModuleFolderName,
  lowerCaseFirst,
} from '@utils';
import generateModule from './generate-module.js';
import { GeneratorConfig } from '@prom-cms/schema';

export const generateProjectModule = async (
  modulesRoot: string,
  projectConfig: GeneratorConfig
) => {
  const moduleName = getModuleFolderName(projectConfig.project.name);
  await generateModule(modulesRoot, moduleName);

  await generateByTemplates(
    'parts.generate-project-module',
    path.join(modulesRoot, moduleName),
    {
      '*': {
        project: projectConfig.project,
        views: {
          prefix: lowerCaseFirst(moduleName),
        },
      },
    }
  );
};
