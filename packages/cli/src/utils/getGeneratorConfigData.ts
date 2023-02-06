import {
  findGeneratorConfig,
  formatGeneratorConfig,
  validateGeneratorConfig,
} from '@prom-cms/shared/generator';
import fs from 'fs-extra';
import tsNode from 'ts-node';
import { isModule } from './isModule.js';

export const getGeneratorConfigData = async (root?: string) => {
  // Enable import of TS files
  tsNode.register();

  const filepath = await findGeneratorConfig(root);

  let content;

  if (isModule(filepath)) {
    content = await import(filepath);
  } else {
    content = await fs.readJSON(filepath);
  }

  return validateGeneratorConfig(await formatGeneratorConfig(content));
};
