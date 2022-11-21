import { z } from 'zod';
import { databaseConfigSchema } from './databaseConfigSchema';
import { projectConfigSchema } from './projectConfigSchema';

export const generatorConfigSchema = z.object({
  project: projectConfigSchema,
  database: databaseConfigSchema,
});
