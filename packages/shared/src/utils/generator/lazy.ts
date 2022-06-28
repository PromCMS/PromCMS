import type {
  formatGeneratorConfig as TypedFormatGeneratorConfig,
  findGeneratorConfig as TypedFindGeneratorConfig,
} from './generator';

const getImport = () => import(/* webpackIgnore: true */ './generator');

export const formatGeneratorConfig = async (
  ...params: Parameters<typeof TypedFormatGeneratorConfig>
) => {
  const ref = (await getImport()).formatGeneratorConfig;

  return ref(...params);
};

export const findGeneratorConfig = async (
  ...params: Parameters<typeof TypedFindGeneratorConfig>
) => {
  const ref = (await getImport()).findGeneratorConfig;

  return ref(...params);
};
