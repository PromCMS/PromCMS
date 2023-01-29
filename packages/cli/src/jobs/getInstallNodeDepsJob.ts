import { getWorkerJob } from '@utils';
import { Select } from '@boost/cli/react';
import { execa } from 'execa';
import { SupportedPackageManagers } from '@custom-types';
import { SUPPORTED_PACKAGE_MANAGERS } from '@constants';

export interface GetInstallNodeDepsJobOptions {
  regenerate?: boolean;
  packageManager?: SupportedPackageManagers;
  cwd: string;
}

export const getInstallNodeDepsJob = (
  title: string,
  {
    packageManager: preselectedPackageManager,
    regenerate,
    cwd,
  }: GetInstallNodeDepsJobOptions
) => {
  return getWorkerJob<{ packageManager?: string }>(title, {
    skip: regenerate,
    prompts: !preselectedPackageManager
      ? [
          [
            'packageManager',
            {
              type: Select,
              props: {
                label: 'What package manager should this project use?',
                options: SUPPORTED_PACKAGE_MANAGERS,
              },
            },
          ],
        ]
      : undefined,
    async job({ packageManager } = {}) {
      const devDeps = [
        'prettier-plugin-twig-melody',
        '@prettier/plugin-php',
        '@prom-cms/vite-plugin',
        'vite',
        'vite-plugin-live-reload',
        'typescript',
      ];
      // const deps = [];

      const finalPackageManager =
        preselectedPackageManager ?? packageManager ?? 'yarn';
      await execa(
        finalPackageManager,
        [
          finalPackageManager === 'yarn' ? 'add' : 'install',
          ...devDeps,
          '--save-dev',
        ],
        {
          cwd: cwd,
        }
      );
    },
  });
};
