import path from 'path';
import fs from 'fs-extra';
import { supportedConfigExtensions } from '@prom-cms/shared';

export const validateConfigPathInput = (value: string | undefined) => {
  if (!value) {
    throw new Error('PromCMS config path not defined in -c value');
  }

  const requestedPath = path.join(process.cwd(), value);
  if (!fs.pathExistsSync(requestedPath)) {
    throw new Error(`PromCMS config path "${requestedPath}" does not exist`);
  }

  if (
    supportedConfigExtensions
      .map((v) => `.${v}`)
      .findIndex((supportedExtension) => value.endsWith(supportedExtension)) ===
    -1
  ) {
    throw new Error('Unsupported config extension: ');
  }
};
