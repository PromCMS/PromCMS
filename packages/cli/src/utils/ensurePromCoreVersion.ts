import { MINIMUM_SUPPORTED_PROM_CORE_PHP } from '@constants';

import { ensurePhpDependencyVersions } from './ensurePhpDependencyVersions.js';

export const ensurePromCoreVersion = async (cwd: string) =>
  ensurePhpDependencyVersions({
    cwd,
    versions: [
      {
        packageName: 'prom-cms/core',
        minimalVersion: MINIMUM_SUPPORTED_PROM_CORE_PHP,
      },
    ],
  });
