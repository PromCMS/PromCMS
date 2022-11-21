import { z } from 'zod';
import { databaseConfigModelSchema } from './databaseConfigModelSchema';

export const databaseConfigSchema = z.object({
  models: z.record(z.string().min(1), databaseConfigModelSchema),
});
