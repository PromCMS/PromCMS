import findConfig from 'find-config';
import { join } from 'path';
import { dirname } from 'path';
import { ExportConfig } from '../types';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const PROJECT_ROOT = join(__dirname, '..', '..', '..', '..');

export const ADMIN_PROJECT_ROOT = join(PROJECT_ROOT, 'packages', 'admin');
export const CORE_ROOT = join(PROJECT_ROOT, 'packages', 'core');

export const GENERATOR_FILENAME = 'prom.generate-config.js';
export const GENERATOR_FILE_PATH = join(PROJECT_ROOT, GENERATOR_FILENAME);
export const GENERATOR_CONFIG: ExportConfig | undefined =
  findConfig.require(GENERATOR_FILENAME, { module: true }) ||
  JSON.parse(process.env.PROM_JSON_CONFIG || 'null');
