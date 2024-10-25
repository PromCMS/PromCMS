import { z } from 'zod';

import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeBooleanSchema = columnTypeBaseSchema
  .omit({ identifier: true })
  .extend({
    type: z.enum(['boolean']),
    defaultValue: z.boolean().optional(),
  });

export type ColumnTypeBoolean = z.infer<typeof columnTypeBooleanSchema>;
