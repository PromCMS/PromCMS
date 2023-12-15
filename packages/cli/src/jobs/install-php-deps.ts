import { execa } from 'execa';

export type InstallPHPDepsOptions = {
  cwd: string;
};

export const installPHPDeps = async ({ cwd }: InstallPHPDepsOptions) => {
  const depsList = ['prom-cms/core:dev-develop'];
  const devDepsList = [
    'fakerphp/faker',
    'phpunit/phpunit',
    'fakerphp/faker',
    'spatie/phpunit-watcher',
  ];

  await execa('composer', ['require', ...depsList], {
    cwd,
  });

  await execa('composer', ['require', '--dev', ...devDepsList], {
    cwd,
  });
};
