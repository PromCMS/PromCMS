import fs from 'fs-extra';
import path from 'node:path';

import { GeneratorConfig } from '@prom-cms/schema';

import createPropelConfig from './create-propel-config.js';
import { installPHPDeps } from './install-php-deps.js';
import { $ } from "execa";

export type GenerateDevelopModelsOptions = {
  config: GeneratorConfig;
  appRoot: string;
};

const addComposerScripts = async ({
  appRoot,
}: GenerateDevelopModelsOptions) => {
  const filename = path.join(appRoot, 'composer.json');
  const contents = await fs.readJSON(filename, {
    encoding: 'utf8',
  });

  contents.scripts ??= {};

  contents.scripts = {
    ...contents.scripts,
    'build-models': [
      'vendor/bin/prom-cms models:create',
      'composer dump-autoload',
    ],
  };

  await fs.writeJSON(filename, contents);
};

export const generateModels = async function genereateDevelopmentCoreModels(
  options: GenerateDevelopModelsOptions
) {
  const { appRoot } = options;

  await Promise.all([addComposerScripts(options), createPropelConfig(options)]);

  await installPHPDeps({ cwd: appRoot });
  await $({
    cwd: appRoot,
  })`composer run build-models`;
};

export default generateModels;
