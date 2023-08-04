import { Option } from 'commander';
import fs from 'fs-extra';

import { pathToAbsolute } from '@utils';

export const cwdOption = new Option('-c, --cwd <string>', 'specify custom cwd')
  .argParser((value) => {
    if (value && !fs.pathExistsSync(pathToAbsolute(value))) {
      throw new Error(`Provided cwd '${value}' does not exist`);
    }

    return value;
  })
  .default(process.cwd());
