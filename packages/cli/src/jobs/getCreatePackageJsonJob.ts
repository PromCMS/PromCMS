import { ProjectConfig } from '@prom-cms/shared';
import fs from 'fs-extra';
import path from 'path';

import { formatCodeString, getWorkerJob } from '@utils';

const defaultPackageJsonContent = {
  name: '',
  version: '0.1.0',
  description: '',
  license: 'MIT',
  type: 'module',
  scripts: {
    build: 'vite build',
    dev: 'vite',
  },
};

export interface GetCreatePackageJsonJobOptions {
  cwd: string;
  project: ProjectConfig;
}

export const getCreatePackageJsonJob = ({
  cwd,
  project,
}: GetCreatePackageJsonJobOptions): ReturnType<typeof getWorkerJob> => {
  return getWorkerJob('Ensure package.json', {
    async job() {
      const packageJsonPath = path.join(cwd, 'package.json');
      const alreadyExists = await fs.pathExists(packageJsonPath);

      // Update package name if needed
      defaultPackageJsonContent.name = project.slug!;

      if (alreadyExists) {
        const fileContent = await fs.readJson(packageJsonPath, {
          encoding: 'utf-8',
        });

        await fs.writeFile(
          packageJsonPath,
          await formatCodeString(
            JSON.stringify({
              ...defaultPackageJsonContent,
              ...fileContent,
              scripts: {
                ...defaultPackageJsonContent.scripts,
                ...fileContent.scripts,
              },
            }),
            path.basename(packageJsonPath)
          )
        );
      } else {
        await fs.writeJson(packageJsonPath, defaultPackageJsonContent);
      }
    },
  });
};
