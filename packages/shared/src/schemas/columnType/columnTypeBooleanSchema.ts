import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeBooleanSchema = columnTypeBaseSchema.extend({
  type: z.enum(['boolean']),
  default: z.boolean().optional(),
});

export type ColumnTypeBoolean = z.infer<typeof columnTypeBooleanSchema>;
