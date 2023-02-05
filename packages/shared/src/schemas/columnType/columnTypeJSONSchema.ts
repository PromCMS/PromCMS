import { z } from 'zod';
import { columnTypeBaseAdminConfigSchema } from './columnTypeBaseAdminConfigSchema.js';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeJSONSchema = columnTypeBaseSchema.extend({
  type: z.enum(['json']),

  admin: columnTypeBaseAdminConfigSchema
    .extend({
      fieldType: z.enum(['blockEditor', 'jsonEditor']).default('jsonEditor'),
    })
    .default({}),
});

export type ColumnTypeJSON = z.infer<typeof columnTypeJSONSchema>;
