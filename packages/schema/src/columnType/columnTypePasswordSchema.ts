import { z } from 'zod';

import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypePasswordSchema = columnTypeBaseSchema
  .omit({ identifier: true })
  .extend({
    type: z.enum(['password']),
  });

export type ColumnTypePassword = z.infer<typeof columnTypePasswordSchema>;
