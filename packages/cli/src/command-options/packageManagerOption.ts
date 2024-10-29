import { SUPPORTED_PACKAGE_MANAGERS } from '@constants';
import { Option } from 'commander';

export const packageManagerOption = new Option(
  '-p, --packageManager <manager>',
  'specifies node package manager'
).argParser((value) => {
  if (!SUPPORTED_PACKAGE_MANAGERS.includes(value as unknown as any)) {
    throw new Error('Invalid package manager');
  }

  return value;
});
