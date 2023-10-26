import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeEmailSchema = columnTypeBaseSchema.extend({
  type: z.enum(['email']),
  allowedDomains: z.array(z.string()).optional(),

  // admin: columnTypeBaseAdminConfigSchema
  //   .extend({
  //     This endpoint should be called on input in admin and this endpoint should return object with "name" and "value" prop
  //     autocompleteEndpoint: z.string().optional()
  //   })
  //   .default({}),
});

export type ColumnTypeEmail = z.infer<typeof columnTypeEmailSchema>;
export type ColumnTypeEmailInput = z.input<typeof columnTypeEmailSchema>;
