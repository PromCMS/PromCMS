import { execa } from 'execa';

export type InstallPHPDepsOptions = {
  cwd: string;
};

export const installPHPDeps = async ({ cwd }: InstallPHPDepsOptions) => {
  const depsList = ['prom-cms/core', 'rakit/validation'];
  const devDepsList = ['fakerphp/faker:^1.23.0', 'psr/log:^3'];

  await execa('composer', ['require', ...depsList], {
    cwd,
  });

  await execa('composer', ['require', '--dev', ...devDepsList], {
    cwd,
  });
};
