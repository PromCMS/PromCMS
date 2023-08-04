import path from 'path';
import fs from 'fs-extra';

import { PACKAGE_ROOT } from '@constants';

export type CreateAdminFilesOptions = {
  cwd: string;
};

export const createAdminFiles = async ({ cwd }: CreateAdminFilesOptions) => {
  // We will just prebuild admin from package on npm
  const adminRoot = path.resolve(PACKAGE_ROOT, '..', 'admin');

  // And the copy
  const adminFinalPath = path.join(cwd, 'public', 'admin');

  await fs.ensureDir(adminFinalPath);
  await fs.emptyDir(adminFinalPath);

  fs.copy(path.join(adminRoot, 'dist'), path.join(cwd, 'public', 'admin'), {
    recursive: true,
    overwrite: true,
  });
};
