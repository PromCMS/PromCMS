import { findGeneratorConfig } from '@prom-cms/schema';

export const tryFindGeneratorConfig = (cwd: string) => {
  try {
    findGeneratorConfig(cwd);
  } catch (error) {
    throw new Error(`⛔️ Current directory "${cwd}" has no prom config.`);
  }
};
