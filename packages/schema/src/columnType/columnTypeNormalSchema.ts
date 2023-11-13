import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeNormalSchema = columnTypeBaseSchema.extend({
  type: z.enum(['date', 'password', 'dateTime']),
  default: z.string().optional(),
});

export type ColumnTypeNormal = z.infer<typeof columnTypeNormalSchema>;
