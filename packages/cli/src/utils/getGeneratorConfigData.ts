import { validateGeneratorConfig } from '@prom-cms/schema';
import {
  findGeneratorConfig,
  formatGeneratorConfig,
} from '@prom-cms/shared/generator';
import fs from 'fs-extra';
import tsNode from 'ts-node';
import { isModule } from './isModule.js';

export const getGeneratorConfigData = async (root?: string) => {
  const filepath = findGeneratorConfig(root);
  let content;

  if (isModule(filepath)) {
    // Enable import of TS files
    tsNode.register();

    try {
      content = await import(`file:///${filepath}`);
    } catch (error) {
      throw new Error(
        `Failed to load prom config at: ${filepath}, because ${(error as Error)
          ?.message}`
      );
    }

    if ('default' in content) {
      content = content.default;
    }
  } else {
    content = await fs.readJSON(filepath);
  }

  return validateGeneratorConfig(await formatGeneratorConfig(content));
};
