import { createAdminFiles } from '@jobs/create-admin-files.js';
import generateModels from '@jobs/generate-models.js';
import { Logger, formatCodeString } from '@utils';
import { getGeneratorConfigData } from '@utils/getGeneratorConfigData.js';
import { getUsedSchemaPackageVersion } from '@utils/getUsedSchemaPackageVersion.js';
import { runWithProgress } from '@utils/runWithProgress.js';
import fs from 'fs-extra';
import path from 'path';

import { findGeneratorConfig } from '@prom-cms/schema';

type Options = {
  cwd: string;
  admin: boolean;
  updateSchema?: boolean;
};

export const updateProjectAction = async (options: Options) => {
  const { cwd, admin, updateSchema = true } = options;

  const generatorConfigPath = await findGeneratorConfig(cwd);

  if (updateSchema && generatorConfigPath.endsWith('.json')) {
    let existingContent = await fs.readJson(generatorConfigPath);
    const schemaPackageVersion = getUsedSchemaPackageVersion();

    if (existingContent['$schema']) {
      delete existingContent['$schema'];
    }

    const [major, minor, ...patchParts] = schemaPackageVersion.split('.');

    existingContent = {
      $schema: `https://schema.prom-cms.cz/versions/${major}/${minor}/${patchParts.join('.')}/schema.json`,
      ...existingContent,
    };

    await fs.writeFile(
      generatorConfigPath,
      await formatCodeString(
        JSON.stringify(existingContent),
        generatorConfigPath
      )
    );
  }

  // Vadation block
  const generatorConfig = await getGeneratorConfigData(cwd);
  // TODO: Load dotenv

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
