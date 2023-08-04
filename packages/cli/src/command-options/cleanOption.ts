import { Option } from 'commander';

export const cleanOption = new Option(
  '-cl, --clean',
  'specifies if final path should be cleaned'
).default(false);
