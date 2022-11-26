import { GENERATOR_FILENAME } from '../../generator-constants';
import findConfig from 'find-config';
import { supportedConfigExtensions } from '../../constants';
import { replaceFileExtension } from '../replaceFileExtension';

export const findGeneratorConfig = (root?: string) => {
  let filepath = '';

  supportedConfigExtensions.find((extension) => {
    const filename = replaceFileExtension(GENERATOR_FILENAME, extension);

    const resultedFilepath = findConfig(filename, { cwd: root });

    if (resultedFilepath) {
      filepath = resultedFilepath;
    }

    return !!resultedFilepath;
  });

  if (!filepath) {
    throw new Error('No generator filename found');
  }

  return filepath;
};
