export const getEnvFilepath = async () => {
  const findConfig = (await import(/* webpackIgnore: true */ 'find-config'))
    .default;

  return findConfig('.env') || '.env';
};

export const loadRootEnv = async () => {
  const dotenv = (await import(/* webpackIgnore: true */ 'dotenv')).default;

  dotenv.config({ path: await getEnvFilepath() });
};
