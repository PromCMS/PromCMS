import dotenv from 'dotenv';
import findConfig from 'find-config';

export const loadRootEnv = () => {
  dotenv.config({ path: findConfig('.env') || '.env' });
};
