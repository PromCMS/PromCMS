import * as iconSet from 'tabler-icons-react';
import { z } from 'zod';
import { databaseConfigModelSchema } from '../schemas';

export type DatabaseConfigModel = z.infer<typeof databaseConfigModelSchema> & {
  icon: keyof typeof iconSet;
};
