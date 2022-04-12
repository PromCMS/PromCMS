export const getEnvFilepath = async (anotherRoot?: string) => {
  const findConfig = (await import(/* webpackIgnore: true */ 'find-config'))
    .default;

  return findConfig('.env', { cwd: anotherRoot }) || '.env';
};

export const loadRootEnv = async (anotherRoot?: string) => {
  const dotenv = (await import(/* webpackIgnore: true */ 'dotenv')).default;

  dotenv.config({ path: await getEnvFilepath(anotherRoot) });
};
