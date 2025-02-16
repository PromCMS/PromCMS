import { z } from 'zod';

import { databaseConfigConnectionSchema } from './databaseConfigConnectionSchema.js';
import { databaseConfigModelSchema } from './databaseConfigModelSchema.js';
import { databaseConfigSingletonSchema } from './databaseConfigSingletonSchema.js';

export const databaseConfigSchema = z.object({
  connections: z
    .array(databaseConfigConnectionSchema)
    .min(1, 'Provide atleast one connection'),

  /**
   * Repetitive content types - such as posts, products, etc
   */
  models: z
    .array(databaseConfigModelSchema)
    .describe('Repetitive content types - such as posts, products, etc')
    .optional(),
  /**
   * Static content types - such as specific pages or other non-repetitive content
   */
  singletons: z
    .array(databaseConfigSingletonSchema)
    .describe(
      'Static content types - such as specific pages or other non-repetitive content'
    )
    .optional(),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
