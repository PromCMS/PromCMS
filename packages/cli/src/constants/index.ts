import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PROJECT_ROOT = join(__dirname, '..', '..', '..');

export const CORE_ROOT = join(PROJECT_ROOT, 'packages', 'core');
export const CLI_ROOT = join(PROJECT_ROOT, 'packages', 'cli');
