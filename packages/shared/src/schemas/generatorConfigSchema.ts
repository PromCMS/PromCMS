import { z } from 'zod';
import { databaseConfigSchema } from './databaseConfigSchema.js';
import { projectConfigSchema } from './projectConfigSchema.js';

export const generatorConfigSchema = z.object({
  project: projectConfigSchema,
  database: databaseConfigSchema,
});
