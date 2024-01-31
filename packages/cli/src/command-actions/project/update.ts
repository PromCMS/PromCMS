import { createAdminFiles } from '@jobs/create-admin-files.js';
import generateModels from '@jobs/generate-models.js';
import { Logger } from '@utils';
import { getGeneratorConfigData } from '@utils/getGeneratorConfigData.js';
import { runWithProgress } from '@utils/runWithProgress.js';
import fs from 'fs-extra';
import path from 'path';

type Options = {
  cwd: string;
  admin: boolean;
};

export const updateProjectAction = async (options: Options) => {
  const { cwd, admin } = options;

  // Vadation block
  const generatorConfig = await getGeneratorConfigData(cwd);
  // TODO: Load dotenv

  // TODO: do we really need to delete those?
  // await runWithProgress(
  //   Promise.all([fs.emptyDir(rootModelsPath)]),
  //   'Deleting old models'
  // );

  await runWithProgress(
    generateModels({ config: generatorConfig, appRoot: cwd }),
    'Create or updates models'
  );

  if (admin) {
    await runWithProgress(
      fs.remove(path.join(cwd, 'public', 'admin')),
      'Deleting old admin'
    );

    await runWithProgress(createAdminFiles({ cwd }), 'Add admin dashboard');
  }

  Logger.success('Your project is updated!', '🎉');
};
