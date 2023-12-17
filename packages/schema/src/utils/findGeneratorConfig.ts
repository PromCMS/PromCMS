import { createPromConfigPath } from './createPromConfigPath.js';

export const supportedConfigExtensions = [
  'json',
  'js',
  'cjs',
  'mjs',
  'ts',
] as const;

export const findGeneratorConfig = async (root?: string) => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  let filepath = '';

  supportedConfigExtensions.find((extension) => {
    const filename = createPromConfigPath(extension);
    const expectedFilepath = path.join(root ?? '', filename);

    if (!fs.existsSync(expectedFilepath)) {
      return false;
    }

    filepath = expectedFilepath;
    return true;
  });

  if (!filepath) {
    throw new Error(`⛔️ Provided directory "${root}" has no prom config.`);
  }

  return filepath;
};
