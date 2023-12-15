import fs from 'fs-extra';
import path from 'path';

import { MODELS_FOLDER_NAME, MODULE_FOLDER_NAME } from '@constants';
import { createProjectModule } from '@jobs/create-project-module.js';
import { getModuleFolderName, Logger } from '@utils';
import { getGeneratorConfigData } from '@utils/getGeneratorConfigData.js';
import { runWithProgress } from '@utils/runWithProgress.js';
import generateModels from '@jobs/generate-models.js';
import { createAdminFiles } from '@jobs/create-admin-files.js';

type Options = {
  cwd: string;
  admin: boolean;
};

export const updateProjectAction = async (options: Options) => {
  const { cwd, admin } = options;

  const generatorConfig = await getGeneratorConfigData(cwd);
  const rootModuleName = getModuleFolderName(generatorConfig.project.name);
  const rootModulePath = path.join(cwd, MODULE_FOLDER_NAME, rootModuleName);
  const rootModelsPath = path.join(rootModulePath, MODELS_FOLDER_NAME);

  if (await fs.pathExists(rootModelsPath)) {
    await runWithProgress(fs.emptyDir(rootModelsPath), 'Deleting old models');

    const generateModelsOptions = {
      moduleRoot: rootModulePath,
      config: generatorConfig,
    };

    await runWithProgress(
      generateModels({ ...generateModelsOptions, appRoot: cwd }),
      'Create models anew'
    );
  } else {
    Logger.info(`No default module at "${rootModulePath}", creating a new one`);

    const { createdAt: moduleCreatedAt } = await runWithProgress(
      createProjectModule({ cwd, config: generatorConfig }),
      'Add default module'
    );

    Logger.info(`Module created at ${moduleCreatedAt}`);
  }

  if (admin) {
    await runWithProgress(
      fs.remove(path.join(cwd, 'public', 'admin')),
      'Deleting old admin'
    );

    await runWithProgress(createAdminFiles({ cwd }), 'Add admin dashboard');
  }

  Logger.success('Your project is updated!', '🎉');
};
