import { MINIMUM_SUPPORTED_PROM_CORE_PHP } from '@constants';
import { $, execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';

export type InstallPHPDepsOptions = {
  cwd: string;
  /**
   * forcefully installs composer dependencies
   */
  force?: boolean;
};

export const installPHPDeps = async ({ cwd }: InstallPHPDepsOptions) => {
  const vendorDirname = path.join(cwd, 'vendor');
  const vendorFolderHasItems = await fs
    .readdir(vendorDirname)
    .then((items) => !!items.length)
    .catch(() => false);

  if (vendorFolderHasItems) {
    return;
  }

  const depsList = [`prom-cms/core:${MINIMUM_SUPPORTED_PROM_CORE_PHP}`];
  const devDepsList = ['fakerphp/faker', 'phpunit/phpunit'];

  await execa('composer', ['require', ...depsList], {
    cwd,
  });

  await execa('composer', ['require', '--dev', ...devDepsList], {
    cwd,
  });

  await $({ cwd })`composer install`;
};
