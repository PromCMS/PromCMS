import dotenv from 'dotenv';
import findConfig from 'find-config';

export const getEnvFilepath = () => findConfig('.env') || '.env';

export const loadRootEnv = () => {
  dotenv.config({ path: getEnvFilepath() });
};
