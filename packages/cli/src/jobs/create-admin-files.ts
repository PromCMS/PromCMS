import fs from 'fs-extra';
import path from 'path';
import resolve from 'resolve';

export type CreateAdminFilesOptions = {
  cwd: string;
};

export const createAdminFiles = async ({ cwd }: CreateAdminFilesOptions) => {
  // We will just prebuild admin from package on npm
  const adminRoot = await new Promise<string>((finish, reject) =>
    resolve('@prom-cms/admin', (err, resolved) => {
      if (err) {
        return reject(err);
      }

      if (!resolved) {
        return reject(new Error('Module not found'));
      }

      finish(resolved);
    })
  );

  // And the copy
  const adminFinalPath = path.join(cwd, 'public', 'admin');

  await fs.ensureDir(adminFinalPath);
  await fs.emptyDir(adminFinalPath);

  fs.copy(path.join(adminRoot, 'dist'), path.join(cwd, 'public', 'admin'), {
    recursive: true,
    overwrite: true,
  });
};
