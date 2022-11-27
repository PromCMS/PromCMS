import fs from 'fs-extra';

import { GENERATOR_FILENAME } from '../../generator-constants';
import { supportedConfigExtensions } from '../../constants';
import { replaceFileExtension } from '../replaceFileExtension';
import path from 'path';

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
