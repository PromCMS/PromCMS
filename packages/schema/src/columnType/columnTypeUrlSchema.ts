import { z } from 'zod';

import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeUrlSchema = columnTypeBaseSchema.extend({
  type: z.enum(['url']),
  allowedDomains: z.array(z.string()).optional(),
  allowedProtocols: z.array(z.string()).default(['http', 'https']),

  // admin: columnTypeBaseAdminConfigSchema
  //   .extend({
  //     This endpoint should be called on input in admin and this endpoint should return object with "name" and "value" prop
  //     autocompleteEndpoint: z.string().optional()
  //   })
  //   .default({}),
});

export type ColumnTypeUrl = z.infer<typeof columnTypeUrlSchema>;
export type ColumnTypeUrlInput = z.input<typeof columnTypeUrlSchema>;
