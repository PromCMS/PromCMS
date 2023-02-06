import * as iconSet from 'tabler-icons-react';
import { z } from 'zod';
import { databaseConfigModelSchema } from '../index.js';

export type DatabaseConfigModel = z.infer<typeof databaseConfigModelSchema> & {
  icon: keyof typeof iconSet;
};
