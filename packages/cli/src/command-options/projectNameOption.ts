import { Option } from 'commander';

export const projectNameOption = new Option(
  '-n, --name <projectName>',
  'desired project name'
).argParser((value) => {
  if (value && value.trim().length < 2) {
    throw new Error('At least two characters long');
  }

  return value.trim();
});
