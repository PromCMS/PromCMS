import { z } from 'zod';

import { databaseConfigItemBaseSchema } from './databaseConfigItemBaseSchema.js';

export const databaseConfigSingletonSchema = databaseConfigItemBaseSchema;

export type DatabaseConfigSingleton = z.infer<
  typeof databaseConfigSingletonSchema
>;
