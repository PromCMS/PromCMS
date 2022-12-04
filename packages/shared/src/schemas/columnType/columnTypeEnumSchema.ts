import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema';

export const columnTypeEnumSchema = columnTypeBaseSchema.extend({
  type: z.enum(['enum']),
  enum: z.array(z.string().min(1)),
  default: z.string().optional(),
  // TODO: Validate default by enum
});

export type ColumnTypeEnum = z.infer<typeof columnTypeEnumSchema>;
