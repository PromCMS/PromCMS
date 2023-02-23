import fs from 'fs-extra';
import path from 'path';

import { formatCodeString, getWorkerJob } from '@utils';
import { installPHPDeps } from '@parts/install-php-deps';

const defaultContent = {
  name: 'prom-cms/app',
  type: 'project',
  authors: [],
  'require-dev': {},
  require: {},
};

export interface GetCreateComposerJsonJobOptions {
  cwd: string;
  skip?: boolean;
}

export const getCreateComposerJsonJob = (
  title: string,
  { cwd, skip = false }: GetCreateComposerJsonJobOptions
): ReturnType<typeof getWorkerJob> => {
  return getWorkerJob(title, {
    skip,
    async job() {
      const packageJsonPath = path.join(cwd, 'composer.json');
      const alreadyExists = await fs.pathExists(packageJsonPath);

      if (alreadyExists) {
        const fileContent = await fs.readJson(packageJsonPath, {
          encoding: 'utf-8',
        });

        await fs.writeFile(
          packageJsonPath,
          await formatCodeString(
            JSON.stringify({
              ...fileContent,
              ...defaultContent,
              require: {
                ...fileContent['require'],
                ...defaultContent['require'],
              },
              ['require-dev']: {
                ...fileContent['require-dev'],
                ...defaultContent['require-dev'],
              },
            }),
            path.basename(packageJsonPath)
          )
        );
      } else {
        await fs.writeFile(
          packageJsonPath,
          await formatCodeString(
            JSON.stringify(defaultContent),
            path.basename(packageJsonPath)
          )
        );
      }

      // If vendor folder is not yet created then that means that we probably need to install deps
      if ((await fs.pathExists(path.join(cwd, 'vendor'))) === false) {
        await installPHPDeps(cwd);
      }
    },
  });
};
