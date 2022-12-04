import type { findGeneratorConfig as TypedFindGeneratorConfig } from './findGeneratorConfig';

const getImport = () =>
  import(/* webpackIgnore: true */ './findGeneratorConfig');

export const findGeneratorConfig = async (
  ...params: Parameters<typeof TypedFindGeneratorConfig>
) => {
  const ref = (await getImport()).findGeneratorConfig;

  return ref(...params);
};
