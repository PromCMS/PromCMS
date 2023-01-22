import { getWorkerJob } from '@utils';
import { Select } from '@boost/cli/react';
import { execa } from 'execa';
import { SupportedPackageManagers } from '@custom-types';

export interface GetInstallNodeDepsJobOptions {
  regenerate?: boolean;
  packageManager?: SupportedPackageManagers;
  cwd: string;
}

export const getInstallNodeDepsJob = ({
  packageManager: preselectedPackageManager,
  regenerate,
  cwd,
}: GetInstallNodeDepsJobOptions) => {
  return getWorkerJob<{ packageManager?: string }>('Install dependencies', {
    skip: regenerate,
    prompts: !preselectedPackageManager
      ? [
          [
            'packageManager',
            {
              type: Select,
              props: {
                label: 'What package manager should this project use?',
                options: ['yarn', 'npm', 'pnpm'],
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

      await execa(
        preselectedPackageManager ?? packageManager ?? 'yarn',
        ['install', ...devDeps, '--save-dev'],
        {
          cwd: cwd,
        }
      );
    },
  });
};
