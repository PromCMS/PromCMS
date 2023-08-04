import { Option } from 'commander';
import fs from 'fs-extra';

import { pathToAbsolute } from '@utils';

export const cwdOption = new Option(
  '-c, --cwd <string>',
  'specifies custom cwd'
)
  .argParser((value) => {
    const desiredPath = pathToAbsolute(value);

    if (!fs.existsSync(desiredPath)) {
      fs.ensureDirSync(desiredPath);
    }

    return desiredPath;
  })
  .default(process.cwd());
