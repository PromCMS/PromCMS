/**
 * Creates relative path to prom config file inside project
 */
export const createPromConfigPath = (extension: string) =>
  `.prom-cms/config.${extension}`;
