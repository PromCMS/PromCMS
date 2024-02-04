import { PACKAGE_ROOT } from '@constants';
import fs from 'fs-extra';
import path from 'path';
import resolve from 'resolve';

export type CreateAdminFilesOptions = {
  cwd: string;
};

const resolveAdminRoot = () =>
  new Promise<string>((finish, reject) =>
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

export const createAdminFiles = async ({ cwd }: CreateAdminFilesOptions) => {
  // Firstly it could be installed in cli package scope
  let adminRoot = path.resolve(
    PACKAGE_ROOT,
    'node_modules',
    '@prom-cms',
    'admin'
  );

  // Falls back to global scope
  if (!fs.existsSync(adminRoot)) {
    adminRoot = path.resolve(PACKAGE_ROOT, '..', 'admin');
  }

  // Falls back to resolve package, if even that fails then it throws
  if (!fs.existsSync(adminRoot)) {
    adminRoot = await resolveAdminRoot();
  }

  // And the copy
  const adminFinalPath = path.join(cwd, 'public', 'admin');

  await fs.ensureDir(adminFinalPath);
  await fs.emptyDir(adminFinalPath);

  await fs.copy(
    path.join(adminRoot, 'dist'),
    path.join(cwd, 'public', 'admin'),
    {
      recursive: true,
      overwrite: true,
    }
  );
};
