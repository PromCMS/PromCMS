import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema';

export const columnTypeNumberSchema = columnTypeBaseSchema.extend({
  type: z.enum(['number']),
  autoIncrement: z.boolean().optional(),
  default: z.number().optional(),
});

export type ColumnTypeNumber = z.infer<typeof columnTypeNumberSchema>;
