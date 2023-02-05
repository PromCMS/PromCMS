import fs from 'fs';

import path from 'path';
import { supportedConfigExtensions } from '../../../constants.js';
import { replaceFileExtension } from '../../../index.js';
import { GENERATOR_FILENAME } from '../../constants.js';

export const findGeneratorConfig = (root?: string) => {
  let filepath = '';

  supportedConfigExtensions.find((extension) => {
    const filename = replaceFileExtension(GENERATOR_FILENAME, extension);
    const expectedFilepath = path.join(root ?? '', filename);

    if (!fs.existsSync(expectedFilepath)) {
      return false;
    }

    filepath = expectedFilepath;
    return true;
  });

  if (!filepath) {
    throw new Error('No generator file found');
  }

  return filepath;
};
