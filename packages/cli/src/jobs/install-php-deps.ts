import { MINIMUM_SUPPORTED_PROM_CORE_PHP } from '@constants';
import { execa } from 'execa';

export type InstallPHPDepsOptions = {
  cwd: string;
};

export const installPHPDeps = async ({ cwd }: InstallPHPDepsOptions) => {
  const depsList = [`prom-cms/core:${MINIMUM_SUPPORTED_PROM_CORE_PHP}`];
  const devDepsList = ['fakerphp/faker', 'phpunit/phpunit'];

  await execa('composer', ['require', ...depsList], {
    cwd,
  });

  await execa('composer', ['require', '--dev', ...devDepsList], {
    cwd,
  });
};
