import { GENERATOR_FILENAME } from '../../generator-constants';
import findConfig from 'find-config';
import { GeneratorConfig } from '../../types';

export const findGeneratorConfig = (
  root?: string
): Promise<undefined | GeneratorConfig> =>
  findConfig.require(GENERATOR_FILENAME, {
    module: true,
    ...(root ? { cwd: root } : {}),
  });
