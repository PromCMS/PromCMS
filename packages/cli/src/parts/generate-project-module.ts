import { TEMPLATES_ROOT } from '../constants';
import path from 'path';
import { generateByTemplates } from '../utils';
import generateModule from './generate-module';
import {
  capitalizeFirstLetter,
  ProjectConfig,
  removeDiacritics,
} from '@prom-cms/shared';

export const generateProjectModule = async (
  modulesRoot: string,
  projectConfig: ProjectConfig
) => {
  const templatesRoot = path.join(
    TEMPLATES_ROOT,
    'parts',
    'generate-project-module'
  );

  const moduleName = removeDiacritics(
    capitalizeFirstLetter(projectConfig.name, false).split(' ')[0]
  );
  await generateModule(modulesRoot, moduleName);

  await generateByTemplates(templatesRoot, path.join(modulesRoot, moduleName), {
    '*': {
      project: projectConfig,
    },
  });
};
