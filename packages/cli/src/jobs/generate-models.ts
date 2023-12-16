import { GeneratorConfig } from '@prom-cms/schema';
import { $ } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import createPropelConfig from './create-propel-config.js';
import { installPHPDeps } from './install-php-deps.js';

export type GenerateDevelopModelsOptions = {
  config: GeneratorConfig;
  appRoot: string;
};

export const generateModels = async function genereateDevelopmentCoreModels({
  config,
  appRoot,
}: GenerateDevelopModelsOptions) {
  const vendorPathname = path.join(appRoot, 'vendor');
  if (
    !(await fs.pathExists(vendorPathname)) ||
    !(await fs.readdir(vendorPathname).then((items) => !!items.length))
  ) {
    await installPHPDeps({ cwd: appRoot });
  }

  await createPropelConfig({ config, appRoot });
  await $({
    cwd: appRoot,
  })`vendor/bin/propel config:convert --config-dir=./.prom-cms/propel`;
  await $({
    cwd: appRoot,
  })`vendor/bin/propel model:build --config-dir=./.prom-cms/propel`;
};

export default generateModels;
