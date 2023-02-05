import type { findGeneratorConfig as TypedFindGeneratorConfig } from './findGeneratorConfig.js';

const getImport = () =>
  import(/* webpackIgnore: true */ './findGeneratorConfig.js');

export const findGeneratorConfig = async (
  ...params: Parameters<typeof TypedFindGeneratorConfig>
) => {
  const ref = (await getImport()).findGeneratorConfig;

  return ref(...params);
};
