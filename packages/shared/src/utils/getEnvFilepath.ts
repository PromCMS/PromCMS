export const getEnvFilepath = async (anotherRoot?: string) => {
  const findConfig = (await import(/* webpackIgnore: true */ 'find-config'))
    .default;

  return findConfig('.env', { cwd: anotherRoot }) || '.env';
};
