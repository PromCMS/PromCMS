import { z } from 'zod';
import { databaseConfigItemBaseSchema } from './databaseConfigItemBaseSchema.js';

export const databaseConfigSingletonSchema =
  databaseConfigItemBaseSchema.extend({
    /**
     * Custom singleton name to model
     * @default string Key of this object
     */
    name: z.string().min(1).optional(),
  });

export type DatabaseConfigSingleton = z.infer<
  typeof databaseConfigSingletonSchema
>;
