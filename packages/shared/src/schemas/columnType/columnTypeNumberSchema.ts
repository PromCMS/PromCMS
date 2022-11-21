import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema';

export const columnTypeNumberSchema = columnTypeBaseSchema.extend({
  type: z.enum(['number']),
  autoIncrement: z.boolean().nullish(),
  default: z.number().nullish(),
});

export type ColumnTypeNumber = z.infer<typeof columnTypeNumberSchema>;
