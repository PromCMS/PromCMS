import { z } from 'zod';
import { columnTypeBaseAdminConfigSchema } from './columnTypeBaseAdminConfigSchema.js';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeLongTextSchema = columnTypeBaseSchema.extend({
  type: z.enum(['longText']),

  admin: columnTypeBaseAdminConfigSchema
    .extend({
      fieldType: z.enum(['normal', 'wysiwyg']).default('normal'),
    })
    .default({}),
});
