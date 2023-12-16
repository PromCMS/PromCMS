import fs from 'fs';
import path from 'path';

import { createPromConfigPath } from './createPromConfigPath.js';

const supportedConfigExtensions = ['json', 'js', 'cjs', 'mjs', 'ts'] as const;

export const findGeneratorConfig = (root?: string) => {
  let filepath = '';

  supportedConfigExtensions.find((extension) => {
    const filename = createPromConfigPath(extension);
    const expectedFilepath = path.join(root ?? '', filename);
    console.log({ expectedFilepath });

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
