import path from 'path';
import fs from 'fs-extra';

export const getAppRootInputValidator =
  (required = true) =>
  (value: string = '') => {
    if (!value && required) {
      throw new Error('PromCMS root must be specified');
    }

    const requestedPath = path.join(process.cwd(), value);
    if (fs.pathExistsSync(requestedPath)) {
      throw new Error(`PromCMS root "${requestedPath}" already exists`);
    }
  };
