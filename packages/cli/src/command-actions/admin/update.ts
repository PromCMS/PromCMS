import { createAdminFiles } from '@jobs/create-admin-files.js';
import { Logger } from '@utils';
import { runWithProgress } from '@utils/runWithProgress.js';

type Options = {
  cwd: string;
};

export const adminUpdateCommandAction = async (options: Options) => {
  const { cwd } = options;

  await runWithProgress(createAdminFiles({ cwd }), 'Updating admin dashboard');

  Logger.success('Admin dashboard updated!');
};
