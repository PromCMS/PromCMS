import { execa } from 'execa';

export const installPHPDeps = async (appRoot: string) => {
  const depsList = ['prom-cms/core', 'rakit/validation'];
  const devDepsList = ['fakerphp/faker:^1.9.1', 'psr/log:^1'];

  await execa('composer', ['require', ...depsList], {
    cwd: appRoot,
  });

  await execa('composer', ['require', '--dev', ...devDepsList], {
    cwd: appRoot,
  });
};
