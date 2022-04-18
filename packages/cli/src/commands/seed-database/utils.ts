import path, { dirname } from 'path';
import child_process from 'child_process';
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';

const __dirname = dirname(fileURLToPath(import.meta.url));

const spawnPhpExecutable = (execPath: string, args?: any[]) =>
  child_process.spawnSync(
    'php',
    [path.join(__dirname, execPath), ...(args || [])],
    {
      encoding: 'utf8',
    }
  );

export const hashPassword = (barePassword: string) =>
  spawnPhpExecutable('generate-password.php', [barePassword]).stdout;

export const getCarbonTime = () => spawnPhpExecutable('carbon-time.php').stdout;

export const specialStringFaker = (columnName: string) => {
  let finalValue;

  if (columnName.includes('name')) {
    finalValue = faker.company.companyName();
  } else if (columnName.includes('title')) {
    finalValue = faker.name.jobTitle();
  } else if (columnName.includes('avatar')) {
    finalValue = faker.internet.avatar();
  } else if (columnName.includes('email')) {
    finalValue = faker.datatype.uuid() + faker.internet.email().toLowerCase();
  } else {
    finalValue = faker.lorem.word();
  }

  return finalValue;
};
