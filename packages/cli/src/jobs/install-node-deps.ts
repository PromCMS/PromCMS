import { SupportedPackageManagers } from '@custom-types';
import { execa } from 'execa';

export type InstallNodeJsDepsOptions = {
  packageManager: SupportedPackageManagers;
  cwd: string;
};

export const installNodeJsDeps = async ({
  packageManager,
  cwd,
}: InstallNodeJsDepsOptions) => {
  const devDeps = [
    'prettier-plugin-twig-melody',
    '@prettier/plugin-php',
    '@prom-cms/vite',
    'vite',
    'vite-plugin-live-reload',
    'typescript',
  ];
  // const deps = [];

  await execa(
    packageManager,
    [packageManager === 'yarn' ? 'add' : 'install', ...devDeps, '--save-dev'],
    {
      cwd,
    }
  );
};
