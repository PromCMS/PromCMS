import module from 'node:module';

const require = module.createRequire(import.meta.url);

export const getUsedSchemaPackageVersion = () => {
  type PackageJson = {
    name: string;
    version: string;
  };

  const schemaModulePackageJson: PackageJson = require('@prom-cms/schema/package.json');

  return schemaModulePackageJson.version;
};
