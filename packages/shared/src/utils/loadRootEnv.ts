import { getEnvFilepath } from './getEnvFilepath.js';

export const loadRootEnv = async (anotherRoot?: string) => {
  const dotenv = (await import(/* webpackIgnore: true */ 'dotenv')).default;

  dotenv.config({ path: await getEnvFilepath(anotherRoot) });
};
