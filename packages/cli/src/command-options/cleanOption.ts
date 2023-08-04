import { Option } from 'commander';

export const cleanOption = new Option(
  '-cl, --clean',
  'specify if cwd should be cleaned'
).default(false);
