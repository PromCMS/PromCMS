import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
