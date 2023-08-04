import { pathToAbsolute } from '@utils';
import { Option } from 'commander';
import fs from 'fs-extra';

export const jsonFilepathOption = new Option(
  '-f, --file <filePath>',
  'specifies filepath of exported .json file'
).argParser((value) => {
  const desiredFile = pathToAbsolute(value);

  if (!fs.pathExistsSync(desiredFile)) {
    throw new Error(`Path to a file "${value}" does not exists`);
  }

  if (!desiredFile.endsWith('.json')) {
    throw new Error('Must be a json file');
  }

  return desiredFile;
});

jsonFilepathOption.required = true;
