import { z } from 'zod';

import { columnTypeBaseAdminConfigSchema } from './columnTypeBaseAdminConfigSchema.js';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeStringSchema = columnTypeBaseSchema.extend({
  type: z.enum(['string']),

  admin: columnTypeBaseAdminConfigSchema
    .extend({
      fieldType: z.enum(['heading', 'normal']).default('normal'),
    })
    .default({}),

  /**
   * Specifies if current column is a primaryKey
   */
  primaryString: z.boolean().default(false),
});
