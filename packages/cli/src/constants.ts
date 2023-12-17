import path from 'path';
import { fileURLToPath } from 'url';

import { GeneratorConfig } from '@prom-cms/schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const MODULE_FOLDER_NAME = 'modules';
export const MODELS_FOLDER_NAME = 'Models';

export const THANK_YOU_MESSAGE = '✅ Done. Bye!';
export const PACKAGE_ROOT = path.join(__dirname, '..');
export const SCRIPTS_ROOT = path.join(PACKAGE_ROOT, 'scripts');
export const USERS_SCRIPTS_ROOT = path.join(
  SCRIPTS_ROOT,
  'php',
  'commands',
  'users'
);
export const PROJECT_ROOT = path.join(PACKAGE_ROOT, '..', '..');
export const TEMPLATES_ROOT = path.join(PACKAGE_ROOT, 'templates');
export const SUPPORTED_PACKAGE_MANAGERS = ['yarn', 'npm', 'pnpm'] as const;
export const MONOREPO_ROOT = path.join(__dirname, '..', '..', '..');

type ModelColumns = NonNullable<
  GeneratorConfig['database']['models']
>[number]['columns'];
type SingletonColumns = NonNullable<
  GeneratorConfig['database']['singletons']
>[number]['columns'];
type ColumnTypeAsString = (SingletonColumns | ModelColumns)[number]['type'];

export const promColumnTypeToPropelType: Record<ColumnTypeAsString, string> = {
  boolean: 'BOOLEAN',
  date: 'DATE',
  dateTime: 'TIMESTAMP',
  email: 'CHAR',
  enum: 'ENUM',
  // TODO - this should be relationship
  file: 'INTEGER',
  json: 'ARRAY',
  longText: 'LONGVARCHAR',
  number: 'INTEGER',
  password: 'VARCHAR',
  // TODO - this should be assigned dinamically based on related field
  relationship: 'VARCHAR',
  slug: 'VARCHAR',
  string: 'VARCHAR',
  url: 'VARCHAR',
};
