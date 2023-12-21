import dotenv from 'dotenv';
import path from 'node:path';

export const loadDotEnv = (cwd: string) => {
  dotenv.config({
    path: path.join(cwd, '.env'),
  });
};
