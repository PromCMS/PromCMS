import { findGeneratorConfig } from '@prom-cms/schema';

export const tryFindGeneratorConfig = async (cwd: string) => {
  try {
    await findGeneratorConfig(cwd);
  } catch (error) {
    throw new Error(`⛔️ Current directory "${cwd}" has no prom config.`);
  }
};
