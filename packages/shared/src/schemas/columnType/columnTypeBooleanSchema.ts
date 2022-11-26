import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema';

export const columnTypeBooleanSchema = columnTypeBaseSchema.extend({
  type: z.enum(['boolean']),
  default: z.boolean().nullish(),
});

export type ColumnTypeBoolean = z.infer<typeof columnTypeBooleanSchema>;
