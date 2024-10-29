import { formatCodeString } from '@utils';
import { getUsedSchemaPackageVersion } from '@utils/getUsedSchemaPackageVersion.js';
import fs from 'fs-extra';

import { findGeneratorConfig } from '@prom-cms/schema';

export const ensureJsonSchema = async (cwd: string) => {
  const generatorConfigPath = await findGeneratorConfig(cwd);

  if (generatorConfigPath.endsWith('.json')) {
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
};
