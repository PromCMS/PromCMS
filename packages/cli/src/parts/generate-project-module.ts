import { TEMPLATES_ROOT } from '../constants';
import path from 'path';
import {
  generateByTemplates,
  getModuleFolderName,
  lowerCaseFirst,
} from '../utils';
import generateModule from './generate-module';
import { ProjectConfig } from '@prom-cms/shared';

export const generateProjectModule = async (
  modulesRoot: string,
  projectConfig: ProjectConfig
) => {
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-project-module'
  );

  const moduleName = getModuleFolderName(projectConfig.name);
  await generateModule(modulesRoot, moduleName);

  await generateByTemplates(templatesRoot, path.join(modulesRoot, moduleName), {
    '*': {
      project: projectConfig,
      views: {
        prefix: lowerCaseFirst(moduleName),
      },
    },
  });
};
