import { z } from 'zod';
import { databaseConfigModelSchema } from './databaseConfigModelSchema.js';
import { databaseConfigSingletonSchema } from './databaseConfigSingletonSchema.js';

export const databaseConfigSchema = z.object({
  models: z.record(z.string().min(1), databaseConfigModelSchema),
  singletons: z
    .record(z.string().min(1), databaseConfigSingletonSchema)
    .optional(),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
