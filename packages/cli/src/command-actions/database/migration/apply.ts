import { applyMigration } from '@jobs/applyMigration.js';
import { Logger } from '@utils';
import { runWithProgress } from '@utils/runWithProgress.js';

type Options = {
  cwd: string;
};

export const migrationApplyCommandAction = async (options: Options) => {
  const { cwd } = options;

  await runWithProgress(
    applyMigration({ cwd }),
    'Connect to database and upload current models configuration'
  );

  Logger.success('Done!', '🎉');
};
