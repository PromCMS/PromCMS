import { z } from 'zod';

import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeNumberSchema = columnTypeBaseSchema.extend({
  type: z.enum(['number']),
  autoIncrement: z.boolean().optional(),
  defaultValue: z.number().optional(),
  // add validation to admin
  min: z.number().optional(),
  max: z.number().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});

export type ColumnTypeNumber = z.infer<typeof columnTypeNumberSchema>;
