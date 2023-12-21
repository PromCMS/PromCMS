import { createPromConfigPath } from './createPromConfigPath.js';

export const supportedConfigExtensions = [
  'json',
  'js',
  'cjs',
  'mjs',
  'ts',
] as const;

const cache = new Map<string, string>();

export const findGeneratorConfig = async (root: string): Promise<string> => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  let filepath = '';

  if (cache.has(root)) {
    return cache.get(root)!;
  }

  supportedConfigExtensions.find((extension) => {
    const filename = createPromConfigPath(extension);
    const expectedFilepath = path.join(root, filename);

    if (!fs.existsSync(expectedFilepath)) {
      return false;
    }

    filepath = expectedFilepath;
    return true;
  });

  if (!filepath) {
    throw new Error(`⛔️ Provided directory "${root}" has no prom config.`);
  }

  cache.set(root, filepath);

  return filepath;
};
