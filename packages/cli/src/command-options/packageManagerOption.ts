import { Option } from 'commander';

import { SUPPORTED_PACKAGE_MANAGERS } from '@constants';

export const packageManagerOption = new Option(
  '-p, --packageManager <manager>',
  'package manager'
).argParser((value) => {
  if (!SUPPORTED_PACKAGE_MANAGERS.includes(value as unknown as any)) {
    throw new Error('Invalid package manager');
  }

  return value;
});
