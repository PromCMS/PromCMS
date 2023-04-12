import { findGeneratorConfig } from '@prom-cms/shared/generator';

export const tryFindGeneratorConfig = (cwd: string) => {
  try {
    findGeneratorConfig(cwd);
  } catch (error) {
    throw new Error(`⛔️ Current directory "${cwd}" has no prom config.`);
  }
};
