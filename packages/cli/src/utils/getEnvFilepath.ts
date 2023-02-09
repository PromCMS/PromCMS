import findConfig from 'find-config';

export const getEnvFilepath = async (anotherRoot?: string) =>
  findConfig('.env', { cwd: anotherRoot }) || '.env';
