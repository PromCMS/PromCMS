import fs from 'fs-extra';
import path from 'path';

import { formatCodeString, getWorkerJob } from '@utils';
import { ProjectConfig } from '@prom-cms/schema';

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
  skip?: boolean;
}

export const getCreatePackageJsonJob = (
  title: string,
  { cwd, project, skip = false }: GetCreatePackageJsonJobOptions
): ReturnType<typeof getWorkerJob> => {
  return getWorkerJob(title, {
    skip,
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
              ...fileContent,
              ...defaultPackageJsonContent,
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
