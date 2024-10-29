import { compilePromConfig } from '@jobs/compile-prom-config.js';
import { createMigration } from '@jobs/createMigration.js';
import { ensureJsonSchema } from '@jobs/ensureJsonSchema.js';
import { Logger } from '@utils';
import { getGeneratorConfigData } from '@utils/getGeneratorConfigData.js';
import { runWithProgress } from '@utils/runWithProgress.js';

type Options = {
  cwd: string;
};

export const migrationCreateCommandAction = async (options: Options) => {
  const { cwd } = options;
  await ensureJsonSchema(cwd);

  // Vadation block
  const generatorConfig = await getGeneratorConfigData(cwd);

  await runWithProgress(
    compilePromConfig({
      appRoot: cwd,
      config: generatorConfig,
    }),
    'Verify PromCMS config, parse and compile'
  );

  await runWithProgress(createMigration({ cwd }), 'Create or updates models');

  Logger.success('Done!', '🎉');
};
