import {
  Command,
  Options,
  GlobalOptions,
  RunResult,
  ArgList,
} from '@boost/cli';
import { pathToAbsolute } from '@utils';
import fs from 'fs-extra';

interface CustomOptions extends GlobalOptions {
  cwd?: string;
}

export class UserCommandBase extends Command {
  cwd: string = '';
  static options: Options<CustomOptions> = {
    cwd: {
      description: 'Project path',
      type: 'string',
      short: 'c',
      validate(value) {
        if (!value) {
          return true;
        }

        if (!fs.pathExistsSync(pathToAbsolute(value))) {
          throw new Error(`Provided cwd '${value}' does not exist`);
        }
      },
    },
  };

  // Just for typescript sake
  run(...params: ArgList): RunResult | Promise<RunResult> {
    throw new Error('Method not implemented.');
  }
}
