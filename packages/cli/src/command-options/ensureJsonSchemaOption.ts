import { Option } from 'commander';

export const ensureJsonSchemaOption = new Option(
  '--ensure-json-schema',
  'specifies if .json configuration files will be updated and the $schema with current version will be specified'
).default(true);
