import { findGeneratorConfig } from '@prom-cms/shared/generator';

export const tryFindGeneratorConfig = (currentDir = process.cwd()) => {
  try {
    findGeneratorConfig(currentDir);
  } catch (error) {
    throw new Error(
      `⛔️ Current directory "${currentDir}" has no prom config.`
    );
  }
};
