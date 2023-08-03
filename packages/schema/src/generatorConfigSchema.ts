import { z } from 'zod';
import { databaseConfigSchema } from './databaseConfigSchema.js';
import { projectConfigSchema } from './projectConfigSchema.js';

export const generatorConfigSchema = z.object({
  project: projectConfigSchema,
  database: databaseConfigSchema,
});

export type GeneratorConfig = z.infer<typeof generatorConfigSchema>;
export type GeneratorConfigInput = z.input<typeof generatorConfigSchema>;
