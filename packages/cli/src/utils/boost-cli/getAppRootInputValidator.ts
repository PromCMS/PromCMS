import path from 'path';
import fs from 'fs-extra';
import { getFilenameBase } from '../../utils/getFilenameBase.js';
import { GENERATOR_FILENAME } from '@prom-cms/shared/generator';

const generatorFilenameBase = getFilenameBase(GENERATOR_FILENAME);

export const getAppRootInputValidator =
  (required = true) =>
  (value: string = '') => {
    if (!value && required) {
      throw new Error('PromCMS root must be specified');
    }

    // TODO
    // if (
    //   fs
    //     .readdirSync(value)
    //     .findIndex((item) => item.startsWith(generatorFilenameBase)) == -1
    // ) {
    //   throw new Error(`⛔️ Current directory "${value}" has no prom config.`);
    // }
  };
