import { join } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PROJECT_ROOT = join(__dirname, '..', '..', '..', '..');
export const CLI_ROOT = join(PROJECT_ROOT, 'packages', 'cli');
