import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PROJECT_ROOT = join(__dirname, '..', '..', '..');

export const ADMIN_PROJECT_ROOT = join(PROJECT_ROOT, 'packages', 'admin');
export const CORE_ROOT = join(PROJECT_ROOT, 'packages', 'core');

export const GENERATOR_FILENAME = 'prom.generate-config.js';
export const GENERATOR_FILENAME__JSON = 'prom.generate-config.json';
export const GENERATOR_FILE_PATH = join(PROJECT_ROOT, GENERATOR_FILENAME);
