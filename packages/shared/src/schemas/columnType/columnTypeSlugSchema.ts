import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeSlugSchema = columnTypeBaseSchema.extend({
  type: z.enum(['slug']),
  // TODO Add validation if current `of` is string and is valid field
  of: z.string(),
});

export type ColumnTypeSlug = z.infer<typeof columnTypeSlugSchema>;
