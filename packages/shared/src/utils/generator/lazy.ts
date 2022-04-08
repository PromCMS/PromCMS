import type {
  formatGeneratorConfig as TypedFormatGeneratorConfig,
  getGeneratorConfig as TypedGetGeneratorConfig,
} from './generator';

const getImport = () => import(/* webpackIgnore: true */ './generator');

export const formatGeneratorConfig = async (
  ...params: Parameters<typeof TypedFormatGeneratorConfig>
) => {
  const ref = (await getImport()).formatGeneratorConfig;

  return ref(...params);
};

export const getGeneratorConfig = async (
  ...params: Parameters<typeof TypedGetGeneratorConfig>
) => {
  const ref = (await getImport()).getGeneratorConfig;

  return ref(...params);
};
