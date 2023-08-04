import { Option } from 'commander';

export const adminOption = new Option(
  '-a, --admin [boolean]',
  'If creating of admin should be done'
)
  .argParser((value) => value === 'true')
  .default('true');
