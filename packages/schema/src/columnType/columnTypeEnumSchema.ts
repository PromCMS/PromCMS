import { z } from 'zod';

import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeEnumSchema = columnTypeBaseSchema.extend({
  type: z.enum(['enum']),
  enum: z.object({
    name: z.string(),
    values: z.record(z.string().min(1), z.string().min(1)),
  }),
  defaultValue: z.string().optional(),
  // TODO: Validate default by enum
});

export type ColumnTypeEnum = z.infer<typeof columnTypeEnumSchema>;
