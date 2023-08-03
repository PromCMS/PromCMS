import { z } from 'zod';
import { databaseConfigModelSchema } from './databaseConfigModelSchema.js';
import { databaseConfigSingletonSchema } from './databaseConfigSingletonSchema.js';

export const databaseConfigSchema = z.object({
  /**
   * Repetitive content types - such as posts, products, etc
   */
  models: z
    .record(z.string().min(1), databaseConfigModelSchema)
    .describe('Repetitive content types - such as posts, products, etc')
    .optional(),
  /**
   * Static content types - such as specific pages or other non-repetitive content
   */
  singletons: z
    .record(z.string().min(1), databaseConfigSingletonSchema)
    .describe(
      'Static content types - such as specific pages or other non-repetitive content'
    )
    .optional(),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
