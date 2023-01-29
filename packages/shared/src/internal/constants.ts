import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = 3000;

export const monorepoRoot = path.join(__dirname, '..', '..', '..', '..');
export const developmentPHPAppPath = path.join(
  monorepoRoot,
  'node_modules',
  '.prom-cms',
  'php-app'
);
