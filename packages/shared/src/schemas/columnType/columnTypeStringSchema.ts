import { z } from 'zod';
import { columnTypeBaseAdminConfigSchema } from './columnTypeBaseAdminConfigSchema.js';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeStringSchema = columnTypeBaseSchema.extend({
  type: z.enum(['string']),

  admin: columnTypeBaseAdminConfigSchema
    .extend({
      // TODO: Should we ensure that heading is only defined once for current model?
      fieldType: z.enum(['heading', 'normal']).default('normal'),
    })
    .default({}),
});
