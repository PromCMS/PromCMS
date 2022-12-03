import { TEMPLATES_ROOT } from '../constants';
import path from 'path';
import {
  generateByTemplates,
  getModuleFolderName,
  lowerCaseFirst,
} from '../utils';
import generateModule from './generate-module';
import { GeneratorConfig } from '@prom-cms/shared';
import generateModels from './generate-models';

export const generateProjectModule = async (
  modulesRoot: string,
  projectConfig: GeneratorConfig
) => {
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-project-module'
  );

  const moduleName = getModuleFolderName(projectConfig.project.name);
  await generateModule(modulesRoot, moduleName);

  await generateByTemplates(templatesRoot, path.join(modulesRoot, moduleName), {
    '*': {
      project: projectConfig.project,
      views: {
        prefix: lowerCaseFirst(moduleName),
      },
    },
  });

  await generateModels(
    path.join(modulesRoot, moduleName),
    projectConfig.database.models
  );
};
